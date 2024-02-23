import { registerValidation, searchInputValidation } from "./register/register.validation";
import { createDocumentValidation, editDocumentParamsValidation, getDocumentParamsValidation, getDocumentsParamsValidation } from "./document/document.validation";
import { getShareDetailsInputParamsValidation, getShareDocumentByOthersParamValidation, shareDocumentValidation, shareMultiDocumentValidation } from "./shareDoc/shareDoc.validation";
import { createGroupValidation, getGroupsValidation } from "./chatGroup/chatGroup.validation";
import { addNewGroupMembersValidation, makeAdminValidation } from "./chatGroupMember/chatGroupMember.validation";

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
  createGroupValidation,
  getGroupsValidation,
  addNewGroupMembersValidation,
  makeAdminValidation,
};
