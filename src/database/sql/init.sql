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

CREATE TABLE IF NOT EXISTS documentTable (
  fileId BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ownerId BIGINT UNSIGNED NOT NULL,
  label VARCHAR(255) DEFAULT NULL,
  fileURL VARCHAR(255) DEFAULT NULL,
  deleted BOOLEAN NOT NULL DEFAULT 0,
  deleteBy BIGINT UNSIGNED DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (fileId)
);
-- add foregin key in document table
ALTER TABLE documentTable
ADD CONSTRAINT fk_owner
FOREIGN KEY (ownerId) REFERENCES USER_TABLE(userId);

CREATE TABLE IF NOT EXISTS shareDocument (
  shareId BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  fileId BIGINT UNSIGNED NOT NULL,
  sharedUserId BIGINT UNSIGNED NOT NULL,
  permissions ENUM('read', 'write') DEFAULT 'read',
  sharedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fileId) REFERENCES documentTable(fileId),
  FOREIGN KEY (sharedUserId) REFERENCES USER_TABLE(userId),
  CONSTRAINT idx_unique_share UNIQUE INDEX (fileId, sharedUserId)
);
-- add unique index to avoide duplicate records
-- ALTER TABLE shareDocument
-- ADD UNIQUE INDEX idx_unique_share (fileId, sharedUserId);

-- indexex

CREATE INDEX idx_shareDocument_fileId ON shareDocument(fileId);

CREATE INDEX idx_documentTable_fileId ON documentTable(fileId);
CREATE INDEX idx_documentTable_ownerId ON documentTable(ownerId);
