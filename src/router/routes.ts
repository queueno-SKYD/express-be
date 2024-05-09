import { Router } from "express";
import controllers from "../controller";

import { initGroupSocketIoEvents } from "../services/chat/personalChat.services";
import { PathName } from "./pathName";
import { Server } from "socket.io";
import { uploadFile } from "../controller/fileUpload/uploadFile.controller";

export const routes = (router: Router) => {
  router.post(PathName.Register, controllers.RegisterUser);
  router.post(PathName.Login, controllers.Login);
  router.post(PathName.Me, controllers.Me);
  // router.all(PathName.NotFound,NotFound);
  router.post(PathName.DeleteUserByAdmin, controllers.DeleteUserByAdmin);
  router.get(PathName.Me, controllers.Me);
  router.post(PathName.AllUsers, controllers.GetAllUsers);
  router.post(PathName.uploadDocument, controllers.UploadDocument);
  router.post(PathName.getDocument, controllers.GetDocument);
  router.post(PathName.getDocuments, controllers.GetDocuments);
  router.post(PathName.deleteDocument, controllers.DeleteDocument);
  router.post(PathName.editDocument, controllers.EditDocument);
  router.post(PathName.searchUsers, controllers.SearchUsers);
  router.post(PathName.shareDocument, controllers.ShareDocument);
  router.post(PathName.shareWithMultipleUsers, controllers.ShareDocumentWithMultipleUsers);
  router.post(PathName.getShareDetails, controllers.GetShareDetails);
  router.post(PathName.revokeShare, controllers.RevokeAccess);
  router.post(PathName.getSharedDocumentByOthers, controllers.GetShareDocumentsByOthers);
  router.post(PathName.EditUsersByAdmin, controllers.EditUserByAdmin);
  router.post(PathName.CreateGroup, controllers.CreateGroup);
  router.post(PathName.GetAllUserGroups, controllers.GetAllUserGroups);
  router.post(PathName.AddMembers, controllers.AddMembers);
  router.post(PathName.MakeAdmin, controllers.MakeAdmin);
  router.post(PathName.UploadFile, uploadFile);
  router.post(PathName.forgotPassword, controllers.ForgotPassword);
  router.post(PathName.verifyOtp, controllers.VerifyOtp);
  router.post(PathName.GetAllMembers , controllers.GetAllMembers);
  router.all(PathName.NotFound, controllers.NotFound);
};

export const wsRoute = (io: Server) => {
  // initPersonalSocketIoEvents(io)
  initGroupSocketIoEvents(io)
}
                                                                                                                                           
