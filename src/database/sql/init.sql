CREATE DATABASE IF NOT EXISTS skyd_db;

USE skyd_db;

CREATE TABLE IF NOT EXISTS USER_TABLE(
  userId BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(255) DEFAULT NULL,
  lastName VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  imageURL VARCHAR(255) DEFAULT NULL,
  createdBy BIGINT UNSIGNED DEFAULT NULL,
  deleted BOOLEAN NOT NULL DEFAULT 0,
  deleteBy BIGINT UNSIGNED DEFAULT NULL,
  password VARCHAR(255) DEFAULT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  userType INT NOT NULL DEFAULT 0,
  PRIMARY KEY (userId),
  CONSTRAINT UQUserEmail UNIQUE (email)
);
