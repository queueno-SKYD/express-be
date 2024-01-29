export const createUserQuery = `
  INSERT INTO USER_TABLE 
  (firstName, lastName, email, imageURL, createdBy, password, userType) 
  VALUES(?, ?, ?, ?, ?, ?, ?)
`;

export const getUserAllQuery = `
  SELECT * FROM  USER_TABLE WHERE email = ? or userId = ?
`;

export const getUserQuery = `
  SELECT userId, firstName, lastName, email, imageURL, createdAt, createdBy, deleted, deleteBy, userType 
  FROM  USER_TABLE WHERE email = ? or userId = ?`
;

export const updateUserQuery = (setClause: string) => `
  UPDATE USER_TABLE SET ${setClause} WHERE userId = ?
`;

export const hardDeleteUserQuery = `
  DELETE FROM USER_TABLE WHERE userId = ?
`;

export const deleteUserQuery = `
  UPDATE USER_TABLE SET deleted = ? WHERE userId = ?
`;
