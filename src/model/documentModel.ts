import { RowDataPacket } from "mysql2";

export default interface DocumentModel extends RowDataPacket {
  createdAt: Date;
  ownerId: number;
  fileURL: string;
  label: string;
  fileId: number;
  deleted?: boolean;
  deleteBy?: number;
}

export interface UpdateDocumentModel {
  label: string;
}
