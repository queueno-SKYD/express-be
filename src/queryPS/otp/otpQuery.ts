import { ResultSetHeader } from "mysql2";
import {
  deleteOtpQuery,
  getOtpQuery,
  insertOtpQuery,
} from "./otp.sql";
import pool from "../../database";
import logger from "../../../logger";
import { IOtpTable } from "../../database/interface/index";

interface IOTPQuery {
  insertOtpQuery(
    emailId: string,
    otp: number,
    otpType: string
  ): Promise<boolean>;
  getOtp(emailId: string): Promise<IOtpTable | undefined>;
  deleteOtpQuery(emailId: string): Promise<boolean>;
}
class OTPQuery implements IOTPQuery {
  /** insert user query 
    @param emailId 
    @param otp 
    @param otpType  
  */
  public async insertOtpQuery(
    emailId: string,
    otp: number,
    otpType: string
  ): Promise<boolean> {
    await this.deleteOtpQuery(emailId);
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        insertOtpQuery,
        [emailId, otp, otpType],
        async (err) => {
          if (err) {
            logger.fatal(err.message);
            reject(false);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  /** get otp query 
    @param emailId  
  */
  public async getOtp(emailId: string): Promise<IOtpTable | undefined> {
    return new Promise((resolve) => {
      if (emailId) {
        pool.query<ResultSetHeader>(getOtpQuery, [emailId], (err, result) => {
          if (err) {
            logger.fatal(err);
            resolve(undefined);
          } else {
            const data = result[0];
            if (!data) {
              resolve(undefined);
              logger.info("User Not Found");
            }
            logger.info(data.userId, "found user");
            if (data) {
              resolve(data);
            } else {
              resolve(undefined);
            }
          }
        });
      } else {
        resolve(undefined);
        return;
      }
    });
  }

  /** 
    @param emailId 
  */
  public async deleteOtpQuery(emailId: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (emailId) {
        pool.query<ResultSetHeader>(
          deleteOtpQuery,
          [emailId],
          (err, result) => {
            if (err) {
              logger.fatal(err);
              resolve(false);
            } else {
              const data = result[0];
              if (!data) {
                resolve(false);
                logger.info("User Not Found");
              }
              logger.info(data.userId, "found user");
              resolve(true);
            }
          }
        );
      } else {
        resolve(false);
        return;
      }
    });
  }
}

export default new OTPQuery();
