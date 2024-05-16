import { RowDataPacket } from "mysql2";
import { MessageDeliveryStatus } from "../services/chat/chat.types";
import UserModel from "./userModel";
import GroupChatModel from "./groupChatModel";

export default interface GroupMessageModel extends RowDataPacket {
  messageId: number;
  senderId: UserModel["userId"];
  recipientId: GroupChatModel["adminId"];
  messageContentId?: number;
  message: string;
  deliveryStatus: MessageDeliveryStatus;
  sendAt: Date;
}

export interface GroupMessageResponseModel extends RowDataPacket {
  messageId: number;
  senderId: UserModel["userId"];
  recipientId: GroupChatModel["adminId"];
  messageContentId?: number;
  message: string;
  deliveryStatus: MessageDeliveryStatus;
  sendAt: Date;
  imageUrl?: UserModel["imageURL"];
  firstName: UserModel["firstName"];
  lastName?: UserModel["lastName"];
}

export interface GroupMessageInput {
  message: string;
  messageContentId?: number;
  recipientId: GroupChatModel["adminId"];
  senderId: UserModel["userId"];
  sendAt: Date;
}

// also add update interface
