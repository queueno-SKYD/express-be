export const SaveGroupQuery = `
  INSERT INTO groupTable
  (adminId, name, description, profileImageUrl)
  VALUES(?, ?, ?, ?)
`;

export const GetGroupQuery = `
  SELECT * from groupTable
  WHERE groupId = ?
`;

export const GetAllGroupsForUser = `
  SELECT 
      gt.groupId,
      name,
      description,
      profileImageUrl,
      COUNT(gmt.userId) AS totalMembers
  FROM 
      groupTable gt
  JOIN 
      groupMemberTable gmt ON gt.groupId = gmt.groupId
  WHERE 
      gt.groupId IN (
          SELECT groupId 
          FROM groupMemberTable 
          WHERE userId = ?
      )
      AND (COALESCE(name, '') LIKE CONCAT('%', COALESCE(?, ''), '%'))
  GROUP BY 
    gt.groupId, gt.name, gt.description
  Limit ?
  OFFSET ?
`

export const GetTotalGroupsForUser = `
  SELECT
  COUNT(DISTINCT groupId) as total
  FROM groupMemberTable
  WHERE userId = ?
`

