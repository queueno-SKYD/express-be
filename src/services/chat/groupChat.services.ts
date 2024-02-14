import { Socket } from 'socket.io';
import { io } from '../../index'; // Import Socket.IO server
import { SocketNamespace } from '../../websocket/namespace.socket';

import { IGroupMessage } from './chat.types';
import { personalChatMessageValidation } from '../../validation';

const groupMessageNameSpace = io.of(SocketNamespace.GroupChat);

export const createGroupHandler = (socket: Socket) => {
  socket.on('createGroup', async (groupId: string) => {
    // Validate user permissions, create group in database,
    // ... inform socket about success or failure
  });
};

export const joinGroupHandler = (socket: Socket) => {
  socket.on('joinGroup', async (groupId: string) => {
    // Validate user membership, join group in database,
    // ... update socket room, notify other group members
  });
};

export const sendMessageHandler = (socket: Socket) => {
  socket.on('sendMessage', async (message: IGroupMessage) => {
    // Validate user membership, permissions,
    const error = personalChatMessageValidation.validate(message)
    // ... fetch group members from database
    const members = [...]; // Array of member sockets
    members.forEach((member) => {
      member.emit('newMessage', message);
    });
  });
};

// ... create event handlers for other actions as needed

export const initSocketIoEvents = () => {

  io.on('connection', (socket) => {
    createGroupHandler(socket);
    joinGroupHandler(socket);
    sendMessageHandler(socket);
    // ... handle other events

    socket.on('disconnect', () => {
      // Cleanup group memberships as needed
    });
  });
};