import { FileDatabase } from "../../model/documentModel";
export const createDocumentQuery = (tableName: FileDatabase) => `
  INSERT INTO ${tableName} 
  (ownerId, label, fileURL, name, mimeType) 
  VALUES(?, ?, ?, ?, ?)
`;

export const getAllDocumentQuery = (tableName: FileDatabase) => `
  SELECT * from ${tableName} WHERE ownerId = ? and deleted = 0
  ORDER BY fileId
  Limit ?
  OFFSET ?
;
`;

export const getDocumentQuery = (tableName: FileDatabase) => `
  SELECT * 
  FROM  ${tableName} WHERE fileId = ? and ownerId = ? and deleted = 0`
;

export const getTotalQuery = (tableName: FileDatabase) => `
  SELECT COUNT(*) as total FROM ${tableName} WHERE ownerId = ?
`;

export const deleteDocumentQuery = (tableName: FileDatabase) => `
  UPDATE ${tableName} SET deleted = 1, deleteBy = ? WHERE ownerId = ? and fileId = ?
`;

export const hardDeleteDocumentQuery = (tableName: FileDatabase) => `
  DELETE FROM ${tableName} WHERE userId = ?
`;

export const updateDocumentQuery = (setClause: string, tableName: FileDatabase) => `
  UPDATE ${tableName} SET ${setClause} WHERE fileId = ? and ownerId = ?
`;
