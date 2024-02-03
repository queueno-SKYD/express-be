export const createDocumentQuery = `
  INSERT INTO documentTable 
  (ownerId, label, fileURL) 
  VALUES(?, ?, ?)
`;

export const getAllDocumentQuery = `
  SELECT * from documentTable WHERE ownerId = ?
  ORDER BY fileId
  Limit ?
  OFFSET ?
;
`;

export const getDocumentQuery = `
  SELECT * 
  FROM  documentTable WHERE fileId = ? and ownerId = ?`
;

export const getTotalQuery = `
  SELECT COUNT(*) as total FROM documentTable WHERE ownerId = ?
`;
