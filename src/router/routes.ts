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
import { PathName } from "./pathName";
import { DeleteUserByAdmin } from "../controller/admin/admin.controller";

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
  router.all(PathName.NotFound, NotFound);
};
                                                                                                                                           
