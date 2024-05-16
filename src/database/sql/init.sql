CREATE DATABASE IF NOT EXISTS skyd_db;

USE skyd_db;

CREATE TABLE IF NOT EXISTS userTable(
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
  mimeType VARCHAR(255) DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  deleted BOOLEAN NOT NULL DEFAULT 0,
  deleteBy BIGINT UNSIGNED DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (fileId)
);

-- ALTER TABLE documentTable add mimeType VARCHAR(255) DEFAULT NULL;
-- ALTER TABLE mediaTable add name VARCHAR(255) DEFAULT NULL;
-- add foregin key in document table
ALTER TABLE documentTable
ADD CONSTRAINT fk_owner
FOREIGN KEY (ownerId) REFERENCES userTable(userId);

CREATE TABLE IF NOT EXISTS shareDocument (
  shareId BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  fileId BIGINT UNSIGNED NOT NULL,
  sharedUserId BIGINT UNSIGNED NOT NULL,
  permissions ENUM('read', 'write') DEFAULT 'read',
  sharedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fileId) REFERENCES documentTable(fileId),
  FOREIGN KEY (sharedUserId) REFERENCES userTable(userId),
  CONSTRAINT idx_unique_share UNIQUE INDEX (fileId, sharedUserId)
);
-- add unique index to avoide duplicate records
-- ALTER TABLE shareDocument
-- ADD UNIQUE INDEX idx_unique_share (fileId, sharedUserId);

-- indexex

CREATE INDEX idx_shareDocument_fileId ON shareDocument(fileId);

CREATE INDEX idx_documentTable_fileId ON documentTable(fileId);
CREATE INDEX idx_documentTable_ownerId ON documentTable(ownerId);

CREATE TABLE IF NOT EXISTS imagesTable (
  fileId BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ownerId BIGINT UNSIGNED NOT NULL,
  label VARCHAR(255) DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  fileURL VARCHAR(255) DEFAULT NULL,
  mimeType VARCHAR(255) DEFAULT NULL,
  deleted BOOLEAN NOT NULL DEFAULT 0,
  deleteBy BIGINT UNSIGNED DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (fileId)
);

CREATE TABLE IF NOT EXISTS mediaTable (
  fileId BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ownerId BIGINT UNSIGNED NOT NULL,
  label VARCHAR(255) DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  fileURL VARCHAR(255) DEFAULT NULL,
  mimeType VARCHAR(255) DEFAULT NULL,
  deleted BOOLEAN NOT NULL DEFAULT 0,
  deleteBy BIGINT UNSIGNED DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (fileId)
);

CREATE TABLE IF NOT EXISTS groupTable (
  groupId BIGINT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  adminId BIGINT UNSIGNED NOT NULL,
  description VARCHAR(255) NOT NULL,
  profileImageUrl varchar(255) not null,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleteBy BIGINT UNSIGNED DEFAULT NULL,
  deleted BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (adminId) REFERENCES userTable(userId)
);

ALTER TABLE groupTable 
MODIFY COLUMN groupId BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

CREATE TABLE IF NOT EXISTS groupMemberTable (
  memberId BIGINT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  groupId BIGINT NOT NULL,
  userId BIGINT UNSIGNED NOT NULL,
  joinAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  permissions ENUM('read', 'write') DEFAULT 'write',
  isAdmin BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (groupId) REFERENCES groupTable(groupId),
  FOREIGN KEY (userId) REFERENCES userTable(userId),
  CONSTRAINT id_unique_member UNIQUE (groupId, userId)
);

CREATE TABLE IF NOT EXISTS personalChatTable (
  personalChatId BIGINT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  userId1 BIGINT UNSIGNED NOT NULL,
  userId2 BIGINT UNSIGNED NOT NULL,
  user1Permissions ENUM('read', 'write') DEFAULT 'write',
  user2Permissions ENUM('read', 'write') DEFAULT 'write',
  user1JoinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  user2JoinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  user1LastActive DATETIME DEFAULT CURRENT_TIMESTAMP,
  user2LastActive DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId1) REFERENCES userTable(userId),
  FOREIGN KEY (userId2) REFERENCES userTable(userId)
);



CREATE TABLE IF NOT EXISTS groupMessageTable (
  messageId BIGINT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  senderId BIGINT UNSIGNED NOT NULL,
  -- recipientType ENUM('group', 'personal') NOT NULL,
  recipientId BIGINT UNSIGNED NOT NULL,
  -- messageContentId BIGINT UNSIGNED NOT NULL, -- Assuming you have a separate message_content_table
  messageContentId BIGINT UNSIGNED DEFAULT NULL,
  message VARCHAR(255) NOT NULL,
  deliveryStatus ENUM('sent', 'delivered', 'read') NOT NULL DEFAULT 'sent',
  sendAt DATETIME NOT NULL,
  FOREIGN KEY (senderId) REFERENCES userTable(userId),
  -- FOREIGN KEY (messageContentId) REFERENCES messageContentTable(messageContentId),
  -- Add foreign key constraint for recipient_id based on recipient_type
  CONSTRAINT fkGroupRecipient FOREIGN KEY (recipientId) REFERENCES groupTable(groupId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS personalMessageTable (
  messageId BIGINT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
  senderId BIGINT UNSIGNED NOT NULL,
  -- recipientType ENUM('group', 'personal') NOT NULL,
  recipientId BIGINT UNSIGNED NOT NULL,
  -- messageContentId BIGINT UNSIGNED NOT NULL, -- Assuming you have a separate message_content_table
  messageContentId BIGINT UNSIGNED DEFAULT NULL,
  message VARCHAR(255) NOT NULL,
  deliveryStatus ENUM('sent', 'delivered', 'read') NOT NULL DEFAULT 'sent',
  sendAt DATETIME NOT NULL,
  FOREIGN KEY (senderId) REFERENCES userTable(userId),
  -- FOREIGN KEY (messageContentId) REFERENCES messageContentTable(messageContentId),
  -- Add foreign key constraint for recipient_id based on recipient_type
  CONSTRAINT fkPersonalRecipient FOREIGN KEY (recipientId) REFERENCES personalChatTable(personalChatId) ON DELETE CASCADE
);

ALTER TABLE groupMessageTable 
MODIFY COLUMN recipientType ENUM('group', 'personal') NOT NULL;
groupMessageTable_ibfk_2

CREATE TABLE IF NOT EXISTS messageContentTable (
  messageContentId BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  content JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS otpTable (
    emailId VARCHAR(255) DEFAULT NULL,
    otp BIGINT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    otpType VARCHAR(255) DEFAULT ""
);