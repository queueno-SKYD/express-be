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

/** get All User with Pagination  */
export const getAllUserQuery = `
  select userId, firstName, lastName, email, imageURL, createdAt, createdBy, deleted, deleteBy, userType FROM ${tablesName.userTable} LIMIT ${QUERY_PAGINATION} OFFSET ? ;
`;
