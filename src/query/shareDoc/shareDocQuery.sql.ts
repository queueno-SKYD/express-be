export const shareDocumentMultipleUsersQuery = (placeholders: string) => `
  INSERT INTO shareDocument (fileId, sharedUserId, permissions)
  VALUES ${placeholders}
  ON DUPLICATE KEY UPDATE permissions = VALUES(permissions), sharedOn = NOW()`
;

export const  shareDocumentQuery = `
  INSERT INTO shareDocument (fileId, sharedUserId, permissions)
  VALUES (?, ?, ?)
  ON DUPLICATE KEY UPDATE permissions = VALUES(permissions), sharedOn = NOW();
`;

export const getAllDocumentQuery = `
  SELECT * from documentTable WHERE ownerId = ? and deleted = 0
  ORDER BY fileId
  Limit ?
  OFFSET ?
;
`;

export const getShareDetailsByFileIdQuery = `
  SELECT
  sd.shareId,
  dt.fileId,
  sd.permissions,
  sd.sharedOn,
  ut.userId,
  ut.email,
  ut.firstname,
  ut.lastName,
  ut.imageURL
  FROM
  shareDocument sd
  INNER JOIN documentTable dt ON sd.fileId = dt.fileId
  INNER JOIN USER_TABLE ut ON sd.sharedUserId  = ut.userId
  WHERE
  dt.fileId = ?
  ORDER BY
  sd.sharedOn DESC
  LIMIT ? OFFSET ?;
`;

export const getSharedDocumentsByOtherQuery = `
  SELECT
  sd.shareId,
  dt.fileId,
  sd.permissions,
  sd.sharedOn,
  ut.userId as senderUserId,
  ut.email as senderEmail,
  dt.fileURL,
  dt.label,
  ut.firstname as senderFirstName,
  ut.lastName as senderLastName,
  ut.imageURL as senderImageURL
  FROM
  shareDocument sd
  INNER JOIN documentTable dt ON sd.fileId = dt.fileId
  INNER JOIN USER_TABLE ut ON dt.ownerId  = ut.userId
  WHERE
  sd.sharedUserId = ?
  ORDER BY
  sd.sharedOn DESC
  LIMIT ? OFFSET ?;
`;

export const getTotalShare = `
  SELECT COUNT(*) as total
  FROM shareDocument
  JOIN documentTable ON shareDocument.fileId = documentTable.fileId
  JOIN USER_TABLE ON shareDocument.sharedUserId = USER_TABLE.userId
  WHERE documentTable.fileId = ?;
`;

export const getTotalSharedByOthers = `
  SELECT COUNT(*) as total
  FROM shareDocument
  JOIN documentTable ON shareDocument.fileId = documentTable.fileId
  JOIN USER_TABLE ON documentTable.ownerId = USER_TABLE.userId
  WHERE documentTable.fileId = ?;
`;

export const  revokeAccessDocumentQuery = `
  DELETE FROM shareDocument
  WHERE fileId = ? and sharedUserId = ?;
`;
