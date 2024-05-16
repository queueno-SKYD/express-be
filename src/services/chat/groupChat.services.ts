import { Server, Socket } from "socket.io";
import { SocketNamespace } from "../../websocket/namespace.socket";
import { IMessage } from "./chat.types";
import logger from "../../../logger";
import { GroupChatQuery, GroupMessageModalQuery } from "../../query";
import { chatMessageValidation } from "../../validation";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import { UserAuthenticateWS } from "../../middleware";
import { GroupMessageInput } from "../../model/groupMessageModel";

export const sendGroupMessageHandler = (socket: Socket) => {
  socket.on("sendGroupMessage", async (message: IMessage) => {
    // Validate message format
    const { error } = chatMessageValidation.validate(message);
    if (error) {
      socket.emit(SocketNamespace.Error, new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message}))
    }
    // Validate user membership, permissions,
    const user = socket.data.user;
    try {
      const receiver = await GroupChatQuery.getUserGroupByMember(message.recipientId, user.userId)
      if (receiver) {

        const roomId = receiver.groupId + "gid";
        // save message to messageContentTable
        // save message to message table
        const messagePayload: GroupMessageInput = {
          message: message.message,
          sendAt: message.sendAt,
          senderId: user.userId,
          recipientId: message.recipientId,
        }
        const messageId = await GroupMessageModalQuery.save(messagePayload)
        logger.info(`message saved to db and messageId: ${messageId}`)

        socket.to(roomId).emit("onNewGroupMessage", {
          ...messagePayload,
          messageId,
          imageUrl: user.imageURL,
          firstName: user.firstName,
          lastName: user.lastName,
        })
        // emit to sender
        socket.emit("onNewGroupMessage", {
          ...messagePayload,
          messageId,
          imageUrl: user.imageURL,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      }
      // ... fetch group members from database
    } catch (error) {
      logger.error(error, `error while sending message userId: ${user.userId} receiver id: ${message.recipientId}`)
    }
  });

  socket.on("joinGroup", async (groupId: string) => {
    // Validate message format
    // Validate user membership, permissions,
    const user = socket.data.user;
    
    try {
      const receiver = await GroupChatQuery.getUserGroupByMember(Number(groupId), user.userId)
      if (receiver) {
        const roomId = receiver.groupId + "gid";
        logger.info(`userId: ${user.userId} joined the groupid: ${groupId}`)
        socket.join(roomId);
      }
      // ... fetch group members from database
    } catch (error) {
      logger.error(error, `error while joining to group userId: ${user.userId}`)
    }
  });

  // socket.on("onNewGroupMessage", (data) => {
  //   console.debug(`Someone listening on this: ${data}`)
  // });
};

// ... create event handlers for other actions as needed

export const initGroupSocketIoEvents = (io: Server) => {
  const groupMessageNameSpace = io.of(SocketNamespace.GroupChat);
  groupMessageNameSpace.use(UserAuthenticateWS)
  groupMessageNameSpace.on("connection", (socket) => {
    console.log("group message connection", socket.id)
    sendGroupMessageHandler(socket);
    // ... handle other events

    socket.on("disconnect", () => {
      // Cleanup group memberships as needed
    });
  });
};