import pool from "../../database";
import UserModel from "../../model/userModel";
import { ResultSetHeader } from "mysql2";

interface IUserModalQuery {
  save(user: UserModel): Promise<UserModel>;
  // getById(userId: UserModel["userId"]): Promise<UserModel | undefined>;
  // update(user: UserModel): Promise<number>;
  // delete(userId: UserModel["userId"]): Promise<number>;
  // deleteAll(): Promise<number>;
}

class UserModalQuery implements IUserModalQuery {
  public async save(user: UserModel): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        "INSERT INTO USER_TABLE (firstName, lastName, email, imageURL, createdBy, password) VALUES(?,?,?,?,?,?)",
        [user.firstName, user?.lastName, user.email, user?.imageURL, user?.createdBy, user.password],
        (err, result, fields) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            console.log(result)
            console.log(fields)
            resolve(user)
          }
        }
      )
    });
  }
  // getById(userId: UserModel["userId"]): Promise<UserModel | undefined>;
  // update(user: UserModel): Promise<number>;
  // delete(userId: UserModel["userId"]): Promise<number>;
  // deleteAll(): Promise<number>;
}

export default new UserModalQuery();
