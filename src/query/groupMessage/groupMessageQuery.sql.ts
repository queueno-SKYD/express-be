import { FileDatabase } from "../../model/documentModel";
export const createGroupMessageQuery = `
  INSERT INTO groupMessageTable
  (senderId, recipientId, messageContentId, message, sendAt) 
  VALUES(?, ?, ?, ?, ?)
`;

export const getGroupMessagesQuery = `
  SELECT gm.*, u.firstName, u.lastName, u.imageUrl
  FROM groupMessageTable gm
  JOIN userTable u ON gm.senderId = u.userId
  WHERE gm.recipientId = groupId
    AND gm.senderId IN (
      SELECT gmem.userId 
      FROM groupMemberTable gmem
      WHERE gmem.groupId = ? AND gmem.userId = ?
    )
  ORDER BY gm.sentAt DESC
  LIMIT ? OFFSET ?
;
`;

export const getMessageQuery = `
  SELECT * 
  FROM  groupMessageTable WHERE messageId = ?`
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
