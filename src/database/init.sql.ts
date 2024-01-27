import env from "../env"

export enum tablesName {
  userTable = "USER_TABLE",
}
export enum userTable {
  userId ="userId",
  firstName="firstName",
  lastName="lastName",
  email="email",
  imageURL="imageURL",
  createdBy="createdBy",
  deleted="deleted",
  deleteBy="deleteBy",
  createdAt="createdAt",
  password="password",
}

export const initDBQuery = `
  CREATE DATABASE IF NOT EXISTS ${env.MYSQL_DATABASE};

  USE ${env.MYSQL_DATABASE};

  CREATE TABLE IF NOT EXISTS ${tablesName.userTable}(
    ${userTable.userId} BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ${userTable.firstName} VARCHAR(255) DEFAULT NULL,
    ${userTable.lastName} VARCHAR(255) DEFAULT NULL,
    ${userTable.email} VARCHAR(255) DEFAULT NULL,
    ${userTable.imageURL} VARCHAR(255) DEFAULT NULL,
    ${userTable.createdBy} BIGINT UNSIGNED DEFAULT NULL,
    ${userTable.deleted} BOOLEAN NOT NULL DEFAULT 0,
    ${userTable.password} VARCHAR(255) NOT NULL,
    ${userTable.deleteBy} BIGINT UNSIGNED DEFAULT NULL,
    ${userTable.createdAt} TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (${userTable.userId}),
    CONSTRAINT UQUserEmail UNIQUE (${userTable.email})
  );
`;
