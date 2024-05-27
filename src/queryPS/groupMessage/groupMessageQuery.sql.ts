import { FileDatabase } from "../../model/documentModel";
export const createGroupMessageQuery = `
  INSERT INTO groupMessageTable
  (senderId, recipientId, messageContentId, message, sendAt) 
  VALUES(?, ?, ?, ?, ?)
`;

export const getGroupMessagesQuery = `
SELECT gm.*, u.firstName, u.lastName, u.imageUrl 
FROM 
groupMessageTable gm
JOIN 
userTable u ON gm.senderId = u.userId
WHERE 
gm.recipientId = ? -- Group ID
AND EXISTS (
    SELECT 1 
    FROM groupMemberTable gmem 
    WHERE gmem.groupId = ? -- Group ID (repeated) 
      AND gmem.userId = ? -- Current user's ID
)
  ORDER BY gm.sendAt DESC
  LIMIT ? OFFSET ?
;
`;

export const getMessageQuery = `
  SELECT * 
  FROM  groupMessageTable WHERE messageId = ? and (senderId = ? or recipientId = ?)`
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
