import pool from "../../database";
import DocumentModel, { FileDatabase } from "../../model/documentModel";
import { ResultSetHeader } from "mysql2";
import logger from "../../../logger";
import { createDocumentQuery, getDocumentQuery, getAllDocumentQuery, getTotalQuery, deleteDocumentQuery, updateDocumentQuery } from "./documentQuery.sql";
import { QUERY_PAGINATION } from "../../util/consts";

interface IGetDocuments {
  data: DocumentModel[];
  pageSize: number;
  page: number;
  total: number;
}

interface ISaveDocuments {
  fileURL: string;
  label?: string;
  name?: string;
  mimeType?: string;
}

interface IUpdateDocuments {
  label?: string;
  fileURL?: string;
  fileId: DocumentModel["fileId"], 
}

interface IDocumentModalQuery {
  save(ownerId: DocumentModel["ownerId"], document: ISaveDocuments, databaseName: FileDatabase): Promise<DocumentModel>;
  getDocument(fileId: DocumentModel["fileId"], ownerId: DocumentModel["ownerId"], databaseName: FileDatabase): Promise<DocumentModel | undefined>;
  getDocuments(ownerId: DocumentModel["ownerId"], page: number, databaseName: FileDatabase, pageSize?: number): Promise<IGetDocuments>;
  getTotal(ownerId: DocumentModel["ownerId"], databaseName: FileDatabase): Promise<number>;
  deleteDocument(fileId: DocumentModel["fileId"], ownerId: DocumentModel["ownerId"], deletedBy: DocumentModel["ownerId"], databaseName: FileDatabase): Promise<number>;
  update(ownerId: DocumentModel["ownerId"], payload: IUpdateDocuments, databaseName: FileDatabase): Promise<number>;
  // delete(userId: DocumentModel["userId"]): Promise<number>;
  // hardDelete(userId: DocumentModel["userId"]): Promise<number>;
  // deleteAll(): Promise<number>;
}

class DocumentModalQuery implements IDocumentModalQuery {
  public async save(ownerId: DocumentModel["ownerId"], document: ISaveDocuments, databaseName: FileDatabase): Promise<DocumentModel> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        createDocumentQuery(databaseName),
        [ownerId, document.label, document.fileURL, document?.name, document?.mimeType],
        async (err, result) => {
          if (err) {
            logger.fatal(err.message)
            reject(err)
          } else {
            const fileId = result.insertId;
            logger.info({createdUserId: fileId}, "document created")
            const documentDetails = await this.getDocument(fileId, ownerId, databaseName)
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

  public async getDocument(fileId: DocumentModel["fileId"], ownerId: DocumentModel["ownerId"], databaseName: FileDatabase): Promise<DocumentModel> {
    return new Promise((resolve, reject) => {
      pool.query<DocumentModel[]>(
        getDocumentQuery(databaseName),
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

  public async getDocuments(ownerId: DocumentModel["ownerId"], page: number, databaseName: FileDatabase, pageSize?: number): Promise<IGetDocuments> {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * (pageSize || QUERY_PAGINATION);
      pool.query<DocumentModel[]>(
        getAllDocumentQuery(databaseName),
        [ownerId, pageSize || QUERY_PAGINATION, offset],
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
              const total = await this.getTotal(ownerId, databaseName)
              const queryResponse: IGetDocuments = {
                data: result,
                page: page,
                pageSize: pageSize || QUERY_PAGINATION,
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

  public async getTotal(ownerId: DocumentModel["ownerId"], databaseName: FileDatabase): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query(
        getTotalQuery(databaseName),
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
  public async deleteDocument(fileId: DocumentModel["fileId"], ownerId: DocumentModel["ownerId"], deletedBy: DocumentModel["ownerId"], databaseName: FileDatabase): Promise<number> {
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        deleteDocumentQuery(databaseName), //deleteBy = ? WHERE ownerId = ? and fileId = ?
        [deletedBy, ownerId, fileId],
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

  public async update(ownerId: DocumentModel["ownerId"], payload: IUpdateDocuments, databaseName: FileDatabase): Promise<number> {
    const payloadWithoutFileId = {...payload, fileId: null}
    const setClause = Object.keys(payloadWithoutFileId)
      .map((key) => payloadWithoutFileId[key] ? `${key} = ?` : null)
      .filter(a => a)
      .join(", ");
    const values = Object.values(payloadWithoutFileId).filter(a => a);
    return new Promise((resolve, reject) => {
      pool.query<ResultSetHeader>(
        updateDocumentQuery(setClause, databaseName), //deleteBy = ? WHERE ownerId = ? and fileId = ?
        [...values, payload.fileId, ownerId],
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
