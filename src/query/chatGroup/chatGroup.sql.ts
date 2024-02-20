
/** Update delete flag by admin  */
export const SaveGroupQuery = `
  INSERT INTO groupTable
  (adminId, name, description, profileImageUrl)
  VALUES(?, ?, ?, ?)
`;

export const GetGroupQuery = `
  SELECT * from groupTable
  WHERE groupId = ?
`;

