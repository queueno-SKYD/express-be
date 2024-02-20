import { registerValidation, searchInputValidation } from "./register/register.validation";
import { createDocumentValidation, editDocumentParamsValidation, getDocumentParamsValidation, getDocumentsParamsValidation } from "./document/document.validation";
import {getShareDetailsInputParamsValidation, getShareDocumentByOthersParamValidation, shareDocumentValidation, shareMultiDocumentValidation} from "./shareDoc/shareDoc.validation";

import { personalChatMessageValidation } from "./chatMessage/chat.validation";
import { createGroupValidation } from "./chatGroup/chatGroup.validation";

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
};
