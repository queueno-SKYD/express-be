import { Joi } from "express-validation";

export const shareDocumentValidation = Joi.object({
  fileId: Joi.number().required().min(1),
  sharedUserId: Joi.number().required().required().min(1),
});

export const shareMultiDocumentValidation = Joi.object({
  fileId: Joi.number().required().min(1),
  sharedUserIds: Joi.array().required().items(Joi.number().required().min(1)),
});

export const getShareDetailsInputParamsValidation = Joi.object({
  fileId: Joi.number().required().min(1),
  page: Joi.number().required().min(1),
  pageSize: Joi.number().min(1),
});

export const getShareDocumentByOthersParamValidation = Joi.object({
  page: Joi.number().required().min(1),
  pageSize: Joi.number().min(1),
});
