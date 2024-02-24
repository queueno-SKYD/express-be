import { QUERY_PAGINATION } from "../../util/consts";
import { tablesName, userTable } from "../../database/init.sql";

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
  FROM  USER_TABLE WHERE deleted != 1 and (email = ? or userId = ?)`;

export const updateUserQuery = (setClause: string) => `
  UPDATE USER_TABLE SET ${setClause} WHERE userId = ?
`;

export const hardDeleteUserQuery = `
  DELETE FROM USER_TABLE WHERE userId = ?
`;

export const deleteUserQuery = `
  UPDATE USER_TABLE SET deleted = ? WHERE userId = ?
`;

/** get All User with Pagination  */
export const getAllUserQuery = `
  SELECT userId, firstName, lastName, email, imageURL, createdAt, createdBy, deleted, deleteBy, userType
  FROM   ${tablesName.userTable}
  WHERE deleted != 1 LIMIT ${QUERY_PAGINATION} OFFSET ?`;

export const searchUsersQuery = `
  SELECT userId, firstName, lastName, email, imageURL, userType
  FROM USER_TABLE
  WHERE firstName LIKE CONCAT('%', ?, '%')
      OR lastName LIKE CONCAT('%', ?, '%')
      OR email LIKE CONCAT('%', ?, '%')
  ORDER BY CASE
      WHEN email LIKE CONCAT('%', ?, '%') THEN 1
      WHEN firstName LIKE CONCAT('%', ?, '%') THEN 2
      WHEN lastName LIKE CONCAT('%', ?, '%') THEN 3
      ELSE 4
  END
  LIMIT 15;
`;

export const getUserQueryByEmailId = `
  SELECT userId, firstName, lastName, email, imageURL, createdAt, createdBy, deleted, deleteBy, userType
  FROM   ${tablesName.userTable}
  WHERE ${userTable.email} = ?`;

export const updatePasswordQuery = `UPDATE ${tablesName.userTable}
  SET password = ?
  WHERE email = ?`;
