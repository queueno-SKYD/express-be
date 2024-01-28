import pool from "../../database";
import UserModel from "../../model/userModel";
import { ResultSetHeader } from "mysql2";
import logger from "../../../logger";
import { createUserQuery, getUserAllQuery, getUserQuery } from "./userQuery.sql";

interface IUserModalQuery {
  save(user: UserModel): Promise<UserModel>;
  getUser(userId: UserModel["userId"], email: UserModel["email"], getPassword?: boolean): Promise<UserModel | undefined>;
  // update(user: UserModel): Promise<number>;
  // delete(userId: UserModel["userId"]): Promise<number>;
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
            logger.fatal(err)
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

  public async getUser(userId?: number, email?: string, getPassword?: boolean): Promise<UserModel | undefined > {
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
  // getById(userId: UserModel["userId"]): Promise<UserModel | undefined>;
  // update(user: UserModel): Promise<number>;
  // delete(userId: UserModel["userId"]): Promise<number>;
  // deleteAll(): Promise<number>;
}

export default new UserModalQuery();
