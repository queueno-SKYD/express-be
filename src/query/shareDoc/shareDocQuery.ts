import pool from "../../database";
import DocumentModel from "../../model/documentModel";
import { ResultSetHeader } from "mysql2";
import logger from "../../../logger";
import {getShareDetailsByFileIdQuery, getSharedDocumentsByOtherQuery, getTotalShare, getTotalSharedByOthers, revokeAccessDocumentQuery, shareDocumentMultipleUsersQuery, shareDocumentQuery} from "./shareDocQuery.sql";
import UserModel from "../../model/userModel";
import { IShareDetails, ISharedByOthersDetails, Permissions } from "../../model/shareDocumentModel";
import { QUERY_PAGINATION } from "../../util/consts";

interface IShareDetailsByFileId {
  data: IShareDetails[];
  pageSize: number;
  page: number;
  total: number;
}

interface IGetSharedDocumentsbyOther {
  data: ISharedByOthersDetails[];
  pageSize: number;
  page: number;
  total: number;
}

interface IShareDocumentModalQuery {
  share(fileId: DocumentModel["fileId"], sharedUserId: UserModel["userId"]): Promise<boolean>;
  multiShare(fileId: DocumentModel["fileId"], sharedUserIds: [UserModel["userId"]]): Promise<boolean>;
  getShareDetailsByFileId(
    fileId: DocumentModel["fileId"],
    pageSize:IShareDetailsByFileId["pageSize"],
    page:IShareDetailsByFileId["page"]
  ): Promise<IShareDetailsByFileId>;

  getShareddocumentsByOthers(
    userId: UserModel["userId"],
    pageSize:IShareDetailsByFileId["pageSize"],
    page:IShareDetailsByFileId["page"]
  ): Promise<IGetSharedDocumentsbyOther>;
  getTotal(fileId: DocumentModel["fileId"]): Promise<number>;
  remove(fileId: DocumentModel["fileId"], sharedUserId: UserModel["userId"]): Promise<number>;
  getTotalSharedByOthers(userId: UserModel["fileId"]): Promise<number>
}

class DocumentModalQuery implements IShareDocumentModalQuery {
  public async share(fileId: DocumentModel["fileId"], sharedUserId: UserModel["userId"]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        shareDocumentQuery,
        [fileId, sharedUserId, Permissions.READ],
        async (err, result) => {
          if (err) {
            logger.fatal(err.message)
            reject(err)
          } else {
            const fileId = result.insertId;
            logger.info({createdUserId: fileId}, `document shared with user: ${sharedUserId}`)
            if (fileId) {
              resolve(true)
            } else {
              reject("Something went wrong! document not shared")
            }
          }
        }
      )
    });
  }

  public async multiShare(fileId: DocumentModel["fileId"], sharedUserIds: [UserModel["userId"]]): Promise<boolean> {
    const placeholders = sharedUserIds.map(() => "(?, ?, ?)").join(", ");
    // Flatten the array of values
    // (documentId, sharedWithUserId, permissions)
    const values = sharedUserIds.flatMap(user => [fileId, user, Permissions.READ]);
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        shareDocumentMultipleUsersQuery(placeholders),
        values,
        async (err, result) => {
          if (err) {
            logger.fatal(err, err.message)
            reject({message:"share failed, try later"})
          } else {
            const fileId = result.insertId;
            logger.info({createdUserId: fileId}, `document shared with users: ${sharedUserIds.join(", ")}`)
            if (fileId) {
              resolve(true)
            } else {
              reject({message: "Something went wrong! document not shared"})
            }
          }
        }
      )
    });
  }

  public async getShareDetailsByFileId(
    fileId: DocumentModel["fileId"],
    pageSize:IShareDetailsByFileId["pageSize"],
    page:IShareDetailsByFileId["page"]
  ): Promise<IShareDetailsByFileId> {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * (pageSize || QUERY_PAGINATION);
      pool.query<IShareDetails[]>(
        getShareDetailsByFileIdQuery,
        [fileId, pageSize || QUERY_PAGINATION, offset],
        async (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(err)
          } else {
            const data = result;
            if (!data) {
              reject("document Not Fond");
              logger.info("document Not Found")
            }
            try {
              const total = await this.getTotal(fileId)
              const queryResponse: IShareDetailsByFileId = {
                data,
                page: 1,
                pageSize: 50,
                total: total,
              }
              logger.info(result, "found document share details")
              resolve(queryResponse)
            } catch (error) {
              reject({message: "Error while fetching total", error})
            }
          }
        }
      )
    });
  }

  public async getShareddocumentsByOthers(
    userId: UserModel["userId"],
    pageSize:IShareDetailsByFileId["pageSize"],
    page:IShareDetailsByFileId["page"]
  ): Promise<IGetSharedDocumentsbyOther> {
    console.debug(userId, pageSize, page)
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * (pageSize || QUERY_PAGINATION);
      pool.query<ISharedByOthersDetails[]>(
        getSharedDocumentsByOtherQuery,
        [userId, pageSize || QUERY_PAGINATION, offset],
        async (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(err)
          } else {
            const data = result;
            if (!data) {
              reject("document Not Fond");
              logger.info("document Not Found")
            }
            try {
              const total = await this.getTotalSharedByOthers(userId)
              const queryResponse: IGetSharedDocumentsbyOther = {
                data,
                page: 1,
                pageSize: 50,
                total: total,
              }
              logger.info(result, "found document share details")
              resolve(queryResponse)
            } catch (error) {
              reject({message: "Error while fetching total", error})
            }
          }
        }
      )
    });
  }

  public async getTotal(fileId: DocumentModel["fileId"]): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query(
        getTotalShare,
        [fileId],
        (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(err)
          } else {
            const data = result;
            if (!data) {
              reject("document Not Fond");
              logger.info("document Not Found")
            }
            logger.info(data, "found document")
            resolve(data[0]?.total || 0)
          }
        }
      )
    });
  }

  public async getTotalSharedByOthers(userId: UserModel["fileId"]): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query(
        getTotalSharedByOthers,
        [userId],
        (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(err)
          } else {
            const data = result;
            if (!data) {
              reject("document Not Fond");
              logger.info("document Not Found")
            }
            logger.info(data, "found document")
            resolve(data[0]?.total || 0)
          }
        }
      )
    });
  }

  public async remove(fileId: DocumentModel["fileId"], sharedUserId: UserModel["userId"]): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        revokeAccessDocumentQuery,
        [fileId, sharedUserId],
        (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(err)
          } else {
            if (result.affectedRows > 0) {
              resolve(result.affectedRows)
            } else {
              // No rows were affected, meaning the user with the given userId was not found
              reject({ affectedRows: 0, deleteData: null, message: "document not found"});
            }
          }
        }
      )
    });
  }

}

export default new DocumentModalQuery();
