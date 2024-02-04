import { QUERY_PAGINATION } from "../../util/consts";
import { tablesName } from "../../database/init.sql";

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
  FROM  USER_TABLE WHERE deleted != 1 and (email = ? or userId = ?)`
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

/** get All User with Pagination  */
export const getAllUserQuery = `
  select userId, firstName, lastName, email, imageURL, createdAt, createdBy, deleted, deleteBy, userType FROM   ${tablesName.userTable} WHERE deleted != 1 LIMIT ${QUERY_PAGINATION} OFFSET ?`;
