import { Server, Socket } from "socket.io";
import { SocketNamespace } from "../../websocket/namespace.socket";
import { IPresonalMessage } from "./chat.types";
import logger from "../../../logger";
import { ChatGroupQuery, UserQuery } from "../../query";
import { personalChatMessageValidation } from "../../validation";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import { UserAuthenticateWS } from "../../middleware";

export const sendMessageHandler = (socket: Socket) => {
  socket.on("sendMessage", async (message: IPresonalMessage) => {
    // Validate message format
    const { error } = personalChatMessageValidation.validate(message);
    if (error) {
      socket.emit(SocketNamespace.Error, new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message}))
    }
    // Validate user membership, permissions,
    const user = socket.data.user;
    console.debug("🚀 -----------------------------🚀")
    console.debug("🚀 ~ socket.on ~ user:", user)
    console.debug("🚀 -----------------------------🚀")
    try {
      const receiver = await UserQuery.getUser(message.receiverId);
      if (receiver) {
        const roomId = socket?.id + user?.userId + receiver?.userId;
        logger.info(roomId);
        socket.to("1234").emit("recieavePrivate", message)
      }
      // ... fetch group members from database
    } catch (error) {
      logger.error(error, "error")
    }
  });
};

export const sendGroupMessageHandler = (socket: Socket) => {
  socket.on("sendMessage", async (message: IPresonalMessage) => {
    // Validate message format
    const { error } = personalChatMessageValidation.validate(message);
    if (error) {
      socket.emit(SocketNamespace.Error, new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message}))
    }
    // Validate user membership, permissions,
    const user = socket.data.user;
    console.debug("🚀 -----------------------------🚀")
    console.debug("🚀 ~ message ~ user:", message)
    console.debug("🚀 -----------------------------🚀")
    try {
      const receiver = await ChatGroupQuery.getUserGroupByMember(message.receiverId, user.userId)
      if (receiver) {
        const roomId = receiver.groupId + "group_id_9988qw";
        socket.to(roomId).emit("recieavePrivate", {
          message: message.message, sentAt: message.sendAt,
          imageUrl: user.imageURL,
          firstName: user.firstName,
          lastName: user.lastName,
          senderId: user.userId,
        })
      }
      // ... fetch group members from database
    } catch (error) {
      logger.error(error, "error")
    }
  });

  socket.on("joinGroup", async (groupId: string) => {
    // Validate message format
    // Validate user membership, permissions,
    const user = socket.data.user;
    console.debug("🚀 -----------------------------🚀")
    console.debug("🚀 ~ join group ~ user:", groupId)
    console.debug("🚀 -----------------------------🚀")
    
    try {
      const receiver = await ChatGroupQuery.getUserGroupByMember(Number(groupId), user.userId)
      if (receiver) {
        const roomId = receiver.groupId + "group_id_9988qw";
        socket.join(roomId);
      }
      // ... fetch group members from database
    } catch (error) {
      logger.error(error, "error")
    }
  });
};

// 25:20 // 20:25
// 25:19

//

// 19:

// function to check if reciver exist or not as middleware

export const initPersonalSocketIoEvents = (io: Server) => {
  const personalMessageNameSpace = io.of(SocketNamespace.Personal);
  personalMessageNameSpace.use(UserAuthenticateWS)
  personalMessageNameSpace.on("connection", (socket) => {
    console.log("personal message connection",socket.id)
    sendMessageHandler(socket);
    // ... handle other events

    socket.on("disconnect", () => {
      // Cleanup group memberships as needed
    });
  });
};

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
