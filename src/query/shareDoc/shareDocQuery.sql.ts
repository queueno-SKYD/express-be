export const shareDocumentMultipleUsersQuery = (placeholders: string) => `INSERT INTO Shares (documentId, sharedWithUserId, permissions) VALUES ${placeholders}`;
export const  shareDocumentQuery = `
  INSERT INTO Shares (fileId, sharedUserId, permissions)
  VALUES (?, ?, ?)
  ON DUPLICATE KEY UPDATE permissions = VALUES(permissions);
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
