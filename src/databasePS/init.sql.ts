export enum tablesName {
  userTable = "userTable",
  otpTable = "otpTable",
}
export enum userTable {
  userId = "userId",
  firstName = "firstName",
  lastName = "lastName",
  email = "email",
  imageURL = "imageURL",
  createdBy = "createdBy",
  deleted = "deleted",
  deleteBy = "deleteBy",
  createdAt = "createdAt",
  password = "password",
  userType = "userType",
}
export enum otpTable {
  emailId = "emailId",
  otp = "otp",
  createdAt = "createdAt",
  otptype = "otptype",
}

export const CreateUsers = `CREATE TABLE IF NOT EXISTS userTable (
  userId BIGSERIAL PRIMARY KEY,
  firstName VARCHAR(255) DEFAULT NULL,
  lastName VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL UNIQUE,
  imageURL VARCHAR(255) DEFAULT NULL,
  createdBy BIGINT DEFAULT NULL,
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  userType INT NOT NULL DEFAULT 0,
  password VARCHAR(255) NOT NULL,
  deleteBy BIGINT DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`


export const CreatedocumentTable = `CREATE TABLE IF NOT EXISTS documentTable (
  fileId BIGSERIAL PRIMARY KEY,
  ownerId BIGINT NOT NULL,
  label VARCHAR(255) DEFAULT NULL,
  fileURL VARCHAR(255) DEFAULT NULL,
  mimeType VARCHAR(255) DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleteBy BIGINT DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

export const CreateimagesTable = `CREATE TABLE IF NOT EXISTS imagesTable (
  fileId BIGSERIAL PRIMARY KEY,
  ownerId BIGINT NOT NULL,
  label VARCHAR(255) DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  fileURL VARCHAR(255) DEFAULT NULL,
  mimeType VARCHAR(255) DEFAULT NULL,
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleteBy BIGINT DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`


export const CreatemediaTable = `CREATE TABLE IF NOT EXISTS mediaTable (
  fileId BIGSERIAL PRIMARY KEY,
  ownerId BIGINT NOT NULL,
  label VARCHAR(255) DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  fileURL VARCHAR(255) DEFAULT NULL,
  mimeType VARCHAR(255) DEFAULT NULL,
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleteBy BIGINT DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`


export const CreateshareDocument = `CREATE TABLE IF NOT EXISTS shareDocument (
  shareId BIGSERIAL PRIMARY KEY,
  fileId BIGINT NOT NULL,
  sharedUserId BIGINT NOT NULL,
  permissions VARCHAR(5) CHECK (permissions IN ('read', 'write')) DEFAULT 'read',
  sharedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fileId) REFERENCES documentTable(fileId),
  FOREIGN KEY (sharedUserId) REFERENCES userTable(userId),
  CONSTRAINT idx_unique_share UNIQUE (fileId, sharedUserId)
);`


export const CreategroupTable = `CREATE TABLE IF NOT EXISTS groupTable (
  groupId BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  adminId BIGINT NOT NULL,
  description VARCHAR(255) NOT NULL,
  profileImageUrl VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleteBy BIGINT DEFAULT NULL,
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (adminId) REFERENCES userTable(userId)
);`

export const CreategroupMemberTable = `CREATE TABLE IF NOT EXISTS groupMemberTable (
  memberId BIGSERIAL PRIMARY KEY,
  groupId BIGINT NOT NULL,
  userId BIGINT NOT NULL,
  joinAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  permissions VARCHAR(5) CHECK (permissions IN ('read', 'write')) DEFAULT 'write',
  isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (groupId) REFERENCES groupTable(groupId),
  FOREIGN KEY (userId) REFERENCES userTable(userId),
  CONSTRAINT id_unique_member UNIQUE (groupId, userId)
);`


export const CreatepersonalChatTable = `CREATE TABLE IF NOT EXISTS personalChatTable (
  personalChatId BIGSERIAL PRIMARY KEY,
  userId1 BIGINT NOT NULL,
  userId2 BIGINT NOT NULL,
  user1Permissions VARCHAR(5) CHECK (user1Permissions IN ('read', 'write')) DEFAULT 'write',
  user2Permissions VARCHAR(5) CHECK (user2Permissions IN ('read', 'write')) DEFAULT 'write',
  user1JoinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user2JoinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user1LastActive TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user2LastActive TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId1) REFERENCES userTable(userId),
  FOREIGN KEY (userId2) REFERENCES userTable(userId)
);`

export const CreategroupMessageTable = `CREATE TABLE IF NOT EXISTS groupMessageTable (
  messageId BIGSERIAL PRIMARY KEY,
  senderId BIGINT NOT NULL,
  recipientId BIGINT NOT NULL,
  messageContentId BIGINT DEFAULT NULL,
  message VARCHAR(255) NOT NULL,
  deliveryStatus VARCHAR(10) CHECK (deliveryStatus IN ('sent', 'delivered', 'read')) NOT NULL DEFAULT 'sent',
  sendAt TIMESTAMP NOT NULL,
  FOREIGN KEY (senderId) REFERENCES userTable(userId),
  FOREIGN KEY (recipientId) REFERENCES groupTable(groupId) ON DELETE CASCADE
);`


export const CreatepersonalMessageTable = `CREATE TABLE IF NOT EXISTS personalMessageTable (
  messageId BIGSERIAL PRIMARY KEY,
  senderId BIGINT NOT NULL,
  recipientId BIGINT NOT NULL,
  messageContentId BIGINT DEFAULT NULL,
  message VARCHAR(255) NOT NULL,
  deliveryStatus VARCHAR(10) CHECK (deliveryStatus IN ('sent', 'delivered', 'read')) NOT NULL DEFAULT 'sent',
  sendAt TIMESTAMP NOT NULL,
  FOREIGN KEY (senderId) REFERENCES userTable(userId),
  FOREIGN KEY (recipientId) REFERENCES personalChatTable(personalChatId) ON DELETE CASCADE
);`

export const CreatemessageContentTable = `CREATE TABLE IF NOT EXISTS messageContentTable (
  messageContentId BIGSERIAL PRIMARY KEY,
  content JSON NOT NULL
);`

export const CreateotpTable = `CREATE TABLE IF NOT EXISTS otpTable (
  emailId VARCHAR(255) DEFAULT NULL,
  otp BIGINT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  otpType VARCHAR(255) DEFAULT ''
);

`;
