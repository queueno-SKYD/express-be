export const createUserQuery = `
  INSERT INTO USER_TABLE 
  (firstName, lastName, email, imageURL, createdBy, password) 
  VALUES(?,?,?,?,?,?)
`;

export const getUserAllQuery = `
  SELECT * FROM  USER_TABLE WHERE email = ? or userId = ?
`;

export const getUserQuery = `
  SELECT userId, firstName, lastName, email, imageURL, createdAt, createdBy, deleted, deleteBy 
  FROM  USER_TABLE WHERE email = ? or userId = ?`
;
