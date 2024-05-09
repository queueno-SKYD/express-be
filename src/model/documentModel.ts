import { RowDataPacket } from "mysql2";

export enum FileDatabase {
  documentTable = "documentTable",
  imagesTable = "imagesTable",
  mediaTable = "mediaTable"
}

export enum FileTypes {
  document = "document",
  image = "image",
  media = "media"
}

export default interface DocumentModel extends RowDataPacket {
  createdAt: Date;
  ownerId: number;
  fileURL: string;
  label?: string;
  name: string;
  mimeType: string;
  fileId: number;
  deleted?: boolean;
  deleteBy?: number;
}

export interface UpdateDocumentModel {
  label: string;
}
