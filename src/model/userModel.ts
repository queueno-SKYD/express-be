import { RowDataPacket } from "mysql2";

export default interface UserModel extends RowDataPacket {
  firstName: string;
  lastName?: string;
  email: string;
  imageURL?: string;
  createdBy?: number;
  deleted?: boolean;
  deleteBy?: number;
  createdAt?: Date;
  userId: number;
  password: string;
  userType: number;
}

export interface UserUpdateParams {
  firstName?: string;
  lastName?: string;
  imageURL?: string;
}
