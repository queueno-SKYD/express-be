import { Response, Request } from "express";
import { RegisterUser, Me, GetAllUsers, SearchUsers, ForgotPassword, VerifyOtp } from "./user/user.controller";
import { Login } from "./auth/auth.controller";
import { HTTPResponse, HttpStatus } from "./../httpResponse";
import { UploadDocument, GetDocuments, GetDocument, DeleteDocument, EditDocument } from "./manageDocuments/manageDocuments.controller";
import { GetShareDetails, GetShareDocumentsByOthers, RevokeAccess, ShareDocument, ShareDocumentWithMultipleUsers } from "./shareDocument/shareDocument.controller";
import { DeleteUserByAdmin, EditUserByAdmin } from "./admin/admin.controller";
import { CreateGroup, GetAllUserGroups } from "./groupChat/groupChat.controller";
import { AddMembers, MakeAdmin, GetAllMembers } from "./manageGroup/manageGroup.controller";
import { GetMessageById, GetGroupMessages } from "./groupChat/groupMessage.controller"

const NotFound = async (_: Request, res: Response) => {
  return res.status(404).send(
    new HTTPResponse({statusCode: HttpStatus.NOT_FOUND.code, httpStatus: HttpStatus.NOT_FOUND.status, message: "Not Found"})
  );
}

export default {
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
  EditUserByAdmin,
  DeleteUserByAdmin,
  CreateGroup,
  GetAllUserGroups,
  AddMembers,
  MakeAdmin,
  ForgotPassword,
  VerifyOtp,
  GetAllMembers,
  GetMessageById,
  GetGroupMessages,
};
