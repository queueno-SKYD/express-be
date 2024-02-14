import { Router } from "express";
import {
  RegisterUser,
  Login,
  Me,
  GetAllUsers,
  NotFound,
  UploadDocument,
  GetDocument,
  GetDocuments,
  DeleteDocument,
  EditDocument,
  SearchUsers,
  ShareDocument,
  GetShareDetails,
  RevokeAccess,
  ShareDocumentWithMultipleUsers,
  GetShareDocumentsByOthers
} from "../controller";

import { initPersonalSocketIoEvents } from "../services/chat/personalChat.services";
import { PathName } from "./pathName";
import { DeleteUserByAdmin, EditUserByAdmin } from "../controller/admin/admin.controller";
import { Server } from "socket.io";

export const routes = (router: Router) => {
  router.post(PathName.Register, RegisterUser);
  router.post(PathName.Login, Login);
  router.post(PathName.Me, Me);
  // router.all(PathName.NotFound,NotFound);
  router.post(PathName.AllUsers,GetAllUsers);
  router.post(PathName.DeleteUserByAdmin,DeleteUserByAdmin);
  router.get(PathName.Me, Me);
  router.post(PathName.AllUsers, GetAllUsers);
  router.post(PathName.uploadDocument, UploadDocument);
  router.post(PathName.getDocument, GetDocument);
  router.post(PathName.getDocuments, GetDocuments);
  router.post(PathName.deleteDocument, DeleteDocument);
  router.post(PathName.editDocument, EditDocument);
  router.post(PathName.searchUsers, SearchUsers);
  router.post(PathName.shareDocument, ShareDocument);
  router.post(PathName.shareWithMultipleUsers, ShareDocumentWithMultipleUsers);
  router.post(PathName.getShareDetails, GetShareDetails);
  router.post(PathName.revokeShare, RevokeAccess);
  router.post(PathName.getSharedDocumentByOthers, GetShareDocumentsByOthers);
  router.post(PathName.EditUsersByAdmin, EditUserByAdmin);
  router.all(PathName.WebSocket, (_, res) => res.send(200))
  router.all(PathName.NotFound, NotFound);
};

export const wsRoute = (io: Server) => {
  initPersonalSocketIoEvents(io)
}
                                                                                                                                           
