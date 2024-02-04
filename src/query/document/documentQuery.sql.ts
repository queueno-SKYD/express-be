export const createDocumentQuery = `
  INSERT INTO documentTable 
  (ownerId, label, fileURL) 
  VALUES(?, ?, ?)
`;

export const getAllDocumentQuery = `
  SELECT * from documentTable WHERE ownerId = ? and deleted = 0
  ORDER BY fileId
  Limit ?
  OFFSET ?
;
`;

export const getDocumentQuery = `
  SELECT * 
  FROM  documentTable WHERE fileId = ? and ownerId = ? and deleted = 0`
;

export const getTotalQuery = `
  SELECT COUNT(*) as total FROM documentTable WHERE ownerId = ?
`;

export const deleteDocumentQuery = `
  UPDATE documentTable SET deleted = 1, deleteBy = ? WHERE ownerId = ? and fileId = ?
`;

export const hardDeleteDocumentQuery = `
  DELETE FROM documentTable WHERE userId = ?
`;

export const updateDocumentQuery = (setClause: string) => `
  UPDATE documentTable SET ${setClause} WHERE fileId = ? and ownerId = ?
`;
