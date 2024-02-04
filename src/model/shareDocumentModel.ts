export enum Permissions {
  READ="read",
  WRITE="write",
}

export interface IShareDocument {
  shareId: number;
  fileId: number;
  sharedUserId: number;
  permissions: Permissions,
  sharedOn: Date
}
