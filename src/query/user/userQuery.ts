import pool from "../../database";
import UserModel, { UserUpdateParams } from "../../model/userModel";
import { ResultSetHeader } from "mysql2";
import logger from "../../../logger";
import { createUserQuery, deleteUserQuery, getUserAllQuery, getUserQuery, hardDeleteUserQuery, updateUserQuery } from "./userQuery.sql";

interface IUserModalQuery {
  save(user: UserModel): Promise<UserModel>;
  getUser(userId: UserModel["userId"], email: UserModel["email"], getPassword?: boolean): Promise<UserModel | undefined>;
  update(userId: UserModel["userId"], paylod: UserUpdateParams): Promise<UserModel>;
  delete(userId: UserModel["userId"]): Promise<number>;
  hardDelete(userId: UserModel["userId"]): Promise<number>;
  // deleteAll(): Promise<number>;
}

class UserModalQuery implements IUserModalQuery {
  public async save(user: UserModel): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        createUserQuery,
        [user.firstName, user?.lastName, user.email, user?.imageURL, user?.createdBy, user.password, user?.userType || 0],
        async (err, result) => {
          if (err) {
            logger.fatal(err.message)
            reject(err)
          } else {
            const userId = result.insertId;
            logger.info({createdUserId: userId}, "user created")
            const userData = await this.getUser(userId, user.email)
            if (userData) {
              resolve(userData)
            } else {
              reject("Something went wrong! user not created")
            }
          }
        }
      )
    });
  }

  public async getUser(userId?: number, email?: string, getPassword?: boolean): Promise<UserModel | undefined> {
    return new Promise((resolve, reject) => {
      if (userId || email) {
        pool.query<UserModel[]>(
          getPassword ? getUserAllQuery : getUserQuery,
          [email, userId],
          (err, result) => {
            if (err) {
              logger.fatal(err)
              reject(err)
            } else {
              const data = result[0];
              if (!data) {
                reject("User Not Found");
                logger.info("User Not Found")
              }
              logger.info(data, "found user")
              resolve(data)
            }
          }
        )
      } else {
        reject("incorrect input: userId and email can not be null")
        return;
      }
    });
  }
  public async update(userId: UserModel["userId"], paylod: UserUpdateParams): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      if (userId) {
        // Construct the setClause
        const setClause = Object.keys(paylod)
          .map((key) => paylod[key] ? `${key} = ?` : null)
          .filter(a => a)
          .join(", ");
        // Construct the array of values for the placeholders
        const values = Object.values(paylod).filter(a => a);
        pool.query<ResultSetHeader>(
          updateUserQuery(setClause),
          [...values, userId],
          (err, result) => {
            if (err) {
              logger.fatal(err)
              reject(err)
            } else {
              if (result.affectedRows > 0) {
                // Fetch the updated user data after the update
                this.getUser(userId)
                  .then((updatedUser) => updatedUser ? resolve(updatedUser) : reject("ERROR: USER NOT FOUND AFTER UPDATE"))
                  .catch((fetchError) => reject(fetchError));
              } else {
                // No rows were affected, meaning the user with the given userId was not found
                reject({ affectedRows: 0, updatedData: null, message: "user not found"});
              }
            }
          }
        )
      } else {
        reject("incorrect input: userId can not be null")
        return;
      }
    });
  }
  /**
   * @danger
   * @param userId 
   * @returns delete column from datamase use with caution
   */
  public async hardDelete(userId: UserModel["userId"]): Promise<number> {
    return new Promise((resolve, reject) => {
      if (userId) {
        pool.query<ResultSetHeader>(
          hardDeleteUserQuery,
          [userId],
          (err, result) => {
            if (err) {
              logger.fatal(err)
              reject(err)
            } else {
              if (result.affectedRows > 0) {
                resolve(result.affectedRows)
              } else {
                // No rows were affected, meaning the user with the given userId was not found
                reject({ affectedRows: 0, deleteData: null, message: "user not found"});
              }
            }
          }
        )
      } else {
        reject("incorrect input: userId and email can not be null")
        return;
      }
    });
  }
  /**
   * Soft delete
   * @param userId 
   * @returns update table and change deleted to true
   */
  public async delete(userId: UserModel["userId"]): Promise<number> {
    return new Promise((resolve, reject) => {
      if (userId) {
        pool.query<ResultSetHeader>(
          deleteUserQuery,
          [userId, 1],
          (err, result) => {
            if (err) {
              logger.fatal(err)
              reject(err)
            } else {
              if (result.affectedRows > 0) {
                resolve(result.affectedRows)
              } else {
                // No rows were affected, meaning the user with the given userId was not found
                reject({ affectedRows: 0, deleteData: null, message: "user not found"});
              }
            }
          }
        )
      } else {
        reject("incorrect input: userId and email can not be null")
        return;
      }
    });
  }
  // deleteAll(): Promise<number>;
}

export default new UserModalQuery();
