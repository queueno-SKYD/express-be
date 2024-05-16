import { registerValidation, searchInputValidation } from "./register/register.validation";
import { createDocumentValidation, editDocumentParamsValidation, getDocumentParamsValidation, getDocumentsParamsValidation, uploadfileValidation } from "./document/document.validation";
import { getShareDetailsInputParamsValidation, getShareDocumentByOthersParamValidation, shareDocumentValidation, shareMultiDocumentValidation } from "./shareDoc/shareDoc.validation";

import { chatMessageValidation } from "./chatMessage/chat.validation";
import { createGroupValidation, getGroupsValidation } from "./groupChat/groupChat.validation";
import { addNewGroupMembersValidation, makeAdminValidation, getAllMembersValidation } from "./groupChatMember/groupChatMember.validation";
import { isOTPExpired } from "./otp";
import * as groupChatMessageValidations from "./groupChat/groupChatMessage.validation";

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
  chatMessageValidation,
  createGroupValidation,
  getGroupsValidation,
  addNewGroupMembersValidation,
  makeAdminValidation,
  isOTPExpired,
  getAllMembersValidation,
  uploadfileValidation,
  groupChatMessageValidations,
};
