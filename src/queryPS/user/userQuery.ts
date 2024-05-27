import UserModel, { UserUpdateParams } from "../../model/userModel";
import logger from "../../../logger";
import { createUserQuery, deleteUserQuery, getUserAllQuery, getUserQuery, hardDeleteUserQuery, updateUserQuery, getAllUserQuery, searchUsersQuery, getUserQueryByEmailId, updatePasswordQuery } from "./userQuery.sql";
import { QUERY_PAGINATION } from "../../util/consts";
import { QueryResult, QueryResultBase } from "pg";
import pool from "../../databasePS";

interface IUserModalQuery {
  save(user: UserModel): Promise<UserModel>;
  getUser(userId: UserModel["userId"], email: UserModel["email"], getPassword?: boolean): Promise<UserModel | undefined>;
  update(userId: UserModel["userId"], paylod: UserUpdateParams): Promise<UserModel>;
  delete(userId: UserModel["userId"]): Promise<number>;
  hardDelete(userId: UserModel["userId"]): Promise<number>;
  getAllUsers(pIndex: number): Promise<UserModel[] | undefined>;
  search(searchTerm: string): Promise<UserModel[] | undefined>;
  updateUserPassword(emailId: string, password: string): Promise<boolean>
  // deleteAll(): Promise<number>;
}

class UserModalQuery implements IUserModalQuery {
  
  public async save(user: UserModel): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      pool.query<UserModel>(
        createUserQuery,
        [user.firstName, user?.lastName, user.email, user?.imageURL, user?.createdBy, user.password, user?.userType || 0],
        async (err) => {
          if (err) {
            logger.fatal(err.message)
            reject(err)
          } else {
            const userId = user.userId;
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
              const data = result.rows[0][0];
              if (!data) {
                reject("User Not Found");
                logger.info("User Not Found")
              }
              logger.info(data?.userId, "found user")
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
        pool.query<QueryResultBase>(
          updateUserQuery(setClause),
          [...values, userId],
          (err, result) => {
            if (err) {
              logger.fatal(err)
              reject(err)
            } else {
              if (result.rowCount && result.rowCount > 0) {
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
        pool.query<QueryResultBase>(
          hardDeleteUserQuery,
          [userId],
          (err, result) => {
            if (err) {
              logger.fatal(err)
              reject(err)
            } else {
              if (result.rowCount && result.rowCount > 0) {
                resolve(result.rowCount)
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
        pool.query<QueryResultBase>(
          deleteUserQuery,
          [userId, 1],
          (err, result) => {
            if (err) {
              logger.fatal(err)
              reject(err)
            } else {
              if (result.rowCount && result.rowCount > 0) {
                resolve(result.rowCount)
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
   * get All users Query with Paginations
   * ByKanhaiya lal 
   */
  public async getAllUsers(pIndex: number): Promise<UserModel[] | undefined> {
    return new Promise((resolve, reject) => {
      pool.query<UserModel[]>(
        getAllUserQuery,
        [pIndex * QUERY_PAGINATION],
        (err, result:QueryResult) => {
          if (err) {
            logger.fatal(err)
            reject(undefined);
          } else {
            const data = result.rows;
            if (!data) {
              logger.info("data Not Found")
              reject(undefined);
            }
            logger.info(data, "All Users data ")
            resolve(data)
          }
        }
      )
      
    });
  }
  // deleteAll(): Promise<number>;
  public async search(searchTerm: string): Promise<UserModel[] | undefined> {
    return new Promise((resolve, reject) => {
      pool.query<UserModel[]>(
        searchUsersQuery,
        [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm],
        (err, result:QueryResult) => {
          if (err) {
            logger.fatal(err)
            reject(undefined);
          } else {
            const data = result.rows;
            if (!data) {
              logger.info("data Not Found")
              reject(undefined);
            }
            logger.info(data, "All Users data ")
            resolve(data)
          }
        }
      )
      
    });
  }

  // get userBy EmailId;
  public async getUserByEmailId(emailId: string): Promise<UserModel | undefined> {
    return new Promise((resolve, reject) => {
      pool.query<QueryResult>(
        getUserQueryByEmailId,
        [emailId],
        (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(undefined);
          } else {
            const data = result.rows[0];
            if (!data) {
              logger.info("data Not Found")
              reject(undefined);
            }
            logger.info(data, "User data ")
            resolve(data[0])
          }
        }
      )
      
    });
  }

  // update user password 
  public async updateUserPassword(emailId: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      pool.query<QueryResult>(
        updatePasswordQuery,
        [password,emailId],
        (err) => {
          if (err) {
            logger.fatal(err)
            resolve(false);
          } else {
            return resolve(true)
          }
        }
      )
      
    });
  }
}

export default new UserModalQuery();
