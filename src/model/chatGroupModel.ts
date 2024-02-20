import { RowDataPacket } from "mysql2";

export default interface ChatGroupModel extends RowDataPacket {
  groupId: number;
  name: string;
  description?: string;
  profileImageUrl?: string;
  adminId: number;
  deleted?: boolean;
  deleteBy?: number;
  createdAt: Date;
}
