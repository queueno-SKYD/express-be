import pool from "../../database";
import DocumentModel from "../../model/documentModel";
import { ResultSetHeader } from "mysql2";
import logger from "../../../logger";
import { createDocumentQuery, getDocumentQuery, getAllDocumentQuery, getTotalQuery } from "./documentQuery.sql";
import { QUERY_PAGINATION } from "../../util/consts";

interface IGetDocuments {
  data: DocumentModel[];
  pageSize: number;
  page: number;
  total: number;
}

interface IDocumentModalQuery {
  save(ownerId: DocumentModel["ownerId"], document: DocumentModel): Promise<DocumentModel>;
  getDocument(fileId: DocumentModel["fileId"], ownerId: DocumentModel["ownerId"]): Promise<DocumentModel | undefined>;
  getDocuments(ownerId: DocumentModel["ownerId"], page: number, pageSize: number): Promise<IGetDocuments>;
  getTotal(ownerId: DocumentModel["ownerId"]): Promise<number>;
  // update(userId: DocumentModel["userId"], paylod: UpdateDocumentModel): Promise<DocumentModel>;
  // delete(userId: DocumentModel["userId"]): Promise<number>;
  // hardDelete(userId: DocumentModel["userId"]): Promise<number>;
  // deleteAll(): Promise<number>;
}

class DocumentModalQuery implements IDocumentModalQuery {
  public async save(ownerId: DocumentModel["ownerId"], document: DocumentModel): Promise<DocumentModel> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        createDocumentQuery,
        [ownerId, document.label, document.fileURL],
        async (err, result) => {
          if (err) {
            logger.fatal(err.message)
            reject(err)
          } else {
            const fileId = result.insertId;
            logger.info({createdUserId: fileId}, "document created")
            const documentDetails = await this.getDocument(fileId, ownerId)
            if (documentDetails) {
              resolve(documentDetails)
            } else {
              reject("Something went wrong! document not created")
            }
          }
        }
      )
    });
  }

  public async getDocument(fileId: DocumentModel["fileId"], ownerId: DocumentModel["ownerId"]): Promise<DocumentModel> {
    return new Promise((resolve, reject) => {
      pool.query<DocumentModel[]>(
        getDocumentQuery,
        [fileId, ownerId],
        (err, result) => {
          if (err) {
            logger.fatal(err)
            reject(err)
          } else {
            const data = result[0];
            if (!data) {
              reject("document Not Fond");
              logger.info("document Not Found")
            }
            logger.info(data, "found document")
            resolve(data)
          }
        }
      )
    });
  }

  public async getDocuments(ownerId: DocumentModel["ownerId"], page: number, pageSize?: number): Promise<IGetDocuments> {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * (pageSize || QUERY_PAGINATION);
      pool.query<DocumentModel[]>(
        getAllDocumentQuery,
        [ownerId, pageSize, offset],
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
              const total = await this.getTotal(ownerId)
              const queryResponse: IGetDocuments = {
                data: result,
                page: 1,
                pageSize: 50,
                total: total,
              }
              logger.info(result, "found document")
              resolve(queryResponse)
            } catch (error) {
              reject({message: "Error while fetching total", error})
            }
          }
        }
      )
    });
  }

  public async getTotal(ownerId: DocumentModel["ownerId"]): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query(
        getTotalQuery,
        [ownerId],
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
}

export default new DocumentModalQuery();
