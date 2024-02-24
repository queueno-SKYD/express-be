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
  GetShareDocumentsByOthers,
  ForgotPassword,
  VerifyOtp
} from "../controller";
import { PathName } from "./pathName";
import { DeleteUserByAdmin, EditUserByAdmin } from "../controller/admin/admin.controller";
export const routes = (router: Router) => {
  router.post(PathName.Register, RegisterUser);
  router.post(PathName.Login, Login);
  router.post(PathName.Me, Me);
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
  router.post(PathName.forgotPassword, ForgotPassword);
  router.post(PathName.verifyOtp, VerifyOtp);

  router.all(PathName.NotFound, NotFound);
};
                                                                                                                                           
