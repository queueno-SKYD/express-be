export const SaveGroupMemberQuery = `
  INSERT INTO groupMemberTable
  (groupId, userId, isAdmin)
  VALUES(?, ?, ?)
`;

export const SaveGroupAllMemberQuery = (placeholders: string) => `
  INSERT INTO groupMemberTable (groupId, userId, isAdmin)
  VALUES ${placeholders}
  ON DUPLICATE KEY UPDATE isAdmin = VALUES(isAdmin)`
;

export const GetAllGroupMembers = `
  SELECT userTable.userId, firstName, lastName, imageURL, joinAt, userType, memberId, groupId, joinAt, isAdmin, permissions
  FROM userTable join groupMemberTable on userTable.userId = groupMemberTable.userId
  WHERE groupId = ?
  ORDER BY
    CASE 
      WHEN userTable.userId = ? THEN 1
      WHEN isAdmin = true THEN 2
      ELSE 3
    END
  Limit ?
  OFFSET ?
`;

export const getAllDocumentQuery = `
  SELECT * from groupMemberTable WHERE ownerId = ? and deleted = 0
  ORDER BY fileId
  Limit ?
  OFFSET ?
;
`;

export const getDocumentQuery = `
  SELECT * 
  FROM  groupMemberTable WHERE fileId = ? and ownerId = ? and deleted = 0`
;

export const getTotalMember = `
  SELECT COUNT(*) as total FROM groupMemberTable WHERE groupId = ?
`;

export const isAdminQuery = `
  SELECT * FROM groupMemberTable
  WHERE groupId = ? and userId = ? and isAdmin = true
`

export const makeAdminQuery = `
  UPDATE groupMemberTable
  SET isAdmin = ?
  WHERE groupId = ? and userId = ?
`

export const deleteDocumentQuery = `
  UPDATE groupMemberTable SET deleted = 1, deleteBy = ? WHERE ownerId = ? and fileId = ?
`;

export const hardDeleteDocumentQuery = `
  DELETE FROM groupMemberTable WHERE userId = ?
`;

export const updateDocumentQuery = (setClause: string) => `
  UPDATE groupMemberTable SET ${setClause} WHERE fileId = ? and ownerId = ?
`;
