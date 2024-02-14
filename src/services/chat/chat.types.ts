export interface IMessage {
  /**
   * User Message
   */
  message: string;
  /**
   * Meta: send at
   */
  sendAt: Date;
}

export interface IGroupMessage extends IMessage {
  /**
   * Meta: Group Id
   */
  groupId: number;
}

export interface IPresonalMessage extends IMessage {
  /**
   * Meta: Receiver Id
   */
  receiverId: number;
}
