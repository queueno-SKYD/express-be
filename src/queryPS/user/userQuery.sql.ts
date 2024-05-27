import { QUERY_PAGINATION } from "../../util/consts";

export const createUserQuery = `
INSERT INTO userTable 
(firstName, lastName, email, imageURL, createdBy, password, userType) 
VALUES($1, $2, $3, $4, $5, $6, $7);
`;

export const getUserAllQuery = `
SELECT * FROM userTable WHERE email = $1 OR userId = $2;
`;

export const getUserQuery = `
SELECT userId, firstName, lastName, email, imageURL, createdAt, createdBy, deleted, deleteBy, userType 
FROM userTable 
WHERE deleted != 1 AND (email = $1 OR userId = $2);
`;

export const updateUserQuery = (setClause: string) => `
UPDATE userTable SET ${setClause} WHERE userId = $1;
`;

export const hardDeleteUserQuery = `
DELETE FROM userTable WHERE userId = $1;
`;

export const deleteUserQuery = `
UPDATE userTable SET deleted = $1 WHERE userId = $2;

`;

export const getAllUserQuery = `
SELECT userId, firstName, lastName, email, imageURL, createdAt, createdBy, deleted, deleteBy, userType
FROM userTable
WHERE deleted != 1
LIMIT ${QUERY_PAGINATION} OFFSET $2;
`;

export const searchUsersQuery = `
SELECT userId, firstName, lastName, email, imageURL, userType
FROM userTable
WHERE firstName LIKE CONCAT('%', $1, '%')
    OR lastName LIKE CONCAT('%', $2, '%')
    OR email LIKE CONCAT('%', $3, '%')
ORDER BY CASE
    WHEN email LIKE CONCAT('%', $4, '%') THEN 1
    WHEN firstName LIKE CONCAT('%', $5, '%') THEN 2
    WHEN lastName LIKE CONCAT('%', $6, '%') THEN 3
    ELSE 4
END
LIMIT 15;
`;

export const getUserQueryByEmailId = `
SELECT userId, firstName, lastName, email, imageURL, createdAt, createdBy, deleted, deleteBy, userType
FROM userTable
WHERE email = $1;
`;

export const updatePasswordQuery = `UPDATE userTable
SET password = $1
WHERE email = $2;
`;
