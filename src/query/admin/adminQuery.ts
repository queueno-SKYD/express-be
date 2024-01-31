import { ResultSetHeader } from "mysql2";
import pool from "../../database";
import { DeleteUserByAdmin } from "./admin.sql";
import logger from "../../../logger";
interface IAdminModalQuery {
  deleteUsersByAdmin(userId: number, deletedIds: number[]): Promise<boolean>;
}

class AdminModalQuery implements IAdminModalQuery {

  /** delete users query by admin */
  public async deleteUsersByAdmin(
    userId: number,
    deletedIds: number[]
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        DeleteUserByAdmin(deletedIds),
        [userId],
        (err) => {
          if (err) {
            logger.fatal(err);
            reject(false);
          } else {
            logger.info("All Users data deleted updated!");
            resolve(true);
          }
        }
      );
    });
  }
}

export default new AdminModalQuery();
