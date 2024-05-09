import { RowDataPacket } from "mysql2";

export enum MemberPermissions {
  READ="read",
  WRITE="write",
}

export default interface GroupMemberModel extends RowDataPacket {
  memberId: number;
  groupId: number;
  userId: number;
  isAdmin: boolean;
  permissions: MemberPermissions;
  joinAt: Date;
}
