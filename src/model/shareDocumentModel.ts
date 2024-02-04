import { RowDataPacket } from "mysql2";

export enum Permissions {
  READ="read",
  WRITE="write",
}

export interface IShareDocument extends RowDataPacket {
  shareId: number;
  fileId: number;
  sharedUserId: number;
  permissions: Permissions,
  sharedOn: Date
}

export interface IShareDetails extends RowDataPacket {
  shareId: number;
  fileId: number;
  userId: number;
  permissions: Permissions,
  sharedOn: Date,
  email: string,
  fileURL: string,
  firstname: string,
  lastName?: string,
  imageURL?: string
}

export interface ISharedByOthersDetails extends RowDataPacket {
  shareId: number;
  fileId: number;
  senderUserId: number;
  permissions: Permissions,
  sharedOn: Date,
  senderEmail: string,
  fileURL: string,
  label: string,
  senderFirstName: string,
  senderLastName?: string,
  senderImageURL?: string
}
