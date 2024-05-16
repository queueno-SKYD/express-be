import { registerValidation, searchInputValidation } from "./register/register.validation";
import { createDocumentValidation, editDocumentParamsValidation, getDocumentParamsValidation, getDocumentsParamsValidation, uploadfileValidation } from "./document/document.validation";
import { getShareDetailsInputParamsValidation, getShareDocumentByOthersParamValidation, shareDocumentValidation, shareMultiDocumentValidation } from "./shareDoc/shareDoc.validation";

import { personalChatMessageValidation } from "./chatMessage/chat.validation";
import { createGroupValidation, getGroupsValidation } from "./groupChat/groupChat.validation";
import { addNewGroupMembersValidation, makeAdminValidation, getAllMembersValidation } from "./groupChatMember/groupChatMember.validation";
import { isOTPExpired } from "./otp";

export {
  registerValidation,
  createDocumentValidation,
  getDocumentParamsValidation,
  getDocumentsParamsValidation,
  editDocumentParamsValidation,
  searchInputValidation,
  shareDocumentValidation,
  shareMultiDocumentValidation,
  getShareDetailsInputParamsValidation,
  getShareDocumentByOthersParamValidation,
  personalChatMessageValidation,
  createGroupValidation,
  getGroupsValidation,
  addNewGroupMembersValidation,
  makeAdminValidation,
  isOTPExpired,
  getAllMembersValidation,
  uploadfileValidation,
};
