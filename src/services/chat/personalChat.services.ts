import { Server, Socket } from "socket.io";
import { SocketNamespace } from "../../websocket/namespace.socket";
import { IMessage } from "./chat.types";
import logger from "../../../logger";
import {  UserQuery } from "../../query";
import { chatMessageValidation } from "../../validation";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import { UserAuthenticateWS } from "../../middleware";

export const sendMessageHandler = (socket: Socket) => {
  socket.on("sendMessage", async (message: IMessage) => {
    // Validate message format
    const { error } = chatMessageValidation.validate(message);
    if (error) {
      socket.emit(SocketNamespace.Error, new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message}))
    }
    // Validate user membership, permissions,
    const user = socket.data.user;
    console.debug("🚀 -----------------------------🚀")
    console.debug("🚀 ~ socket.on ~ user:", user)
    console.debug("🚀 -----------------------------🚀")
    try {
      const receiver = await UserQuery.getUser(message.recipientId);
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
