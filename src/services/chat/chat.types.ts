// export interface IMessage {
//   /**
//    * User Message
//    */
//   message: string;
//   /**
//    * Meta: send at
//    */
//   sendAt: Date;
//   /**
//    * Meta: Receiver Id
//    */
//   receiverId: number;
// }

// export interface IGroupMessage extends IMessage {
//   /**
//    * Meta: Group Id
//    */
//   groupId: number;
// }

// export interface IPresonalMessage extends IMessage {
//   /**
//    * Meta: Receiver Id
//    */
//   receiverId: number;
// }

export enum UserPermission {
  /**
   * User can not sent messages but receive messages
   */
  READ="read",
  /**
   * Default permission and user can send and receive messages
   */
  WRITE="write"
}

export enum MessageDeliveryStatus {
  /**
   * 'sent': The message has been sent from the sender.
   */
  SENT="sent",
  /**
   * 'delivered': The message has been delivered to the recipient's server.
   */
  DELIVERED="delivered",
  /**
   * 'read': The message has been read by the recipient.
   */
  READ= "read"
}

export enum RecipientType {
  /**
   * Recipiteant is group
   */
  GROUP="group",
  /**
   * Recipiteant is another user (personal chat between two participent)
   */
  PERSONAL="personal"
}

export interface MessageContent {
  /**
   * The unique identifier for the message content.
   */
  messageContentId: number;
  /**
   * The content of the message in JSON format.
   * The structure can include text segments, media attachments, and other relevant information.
   */
  content: JSON;
}

export interface IMessage {
  /**
   * The ID of the group/personal message where the message was sent.
   */
  recipientId: number;
  /**
   * The actual text content of the message.
   */
  message: string;
  /**
   * The timestamp when the message was sent.
   */
  sendAt: Date;
}

export interface IMessageSavePayload extends IMessage {
  /**
   * The ID of the user who sent the message.
   */
  senderId: number;
}

export interface IMessageDBResponse extends IMessage {
  /**
   * The unique identifier for the message.
   */
  messageId: number;
  /**
   * The ID of the user who sent the message.
   */
  senderId: number;
  /**
   * The ID of the message content associated with this message.
   * Can be null if there is no associated message content.
   */
  messageContentId: number | null;
  /**
   * The delivery status of the message.
   * - 'sent': The message has been sent from the sender.
   * - 'delivered': The message has been delivered to the recipient's server.
   * - 'read': The message has been read by the recipient.
   */
  deliveryStatus: MessageDeliveryStatus;
}
