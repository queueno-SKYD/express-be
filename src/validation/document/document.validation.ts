import { Joi } from "express-validation";

export const createDocumentValidation = Joi.object({
  label: Joi.string().required(),
  fileURL: Joi.string().required(),
});

export const getDocumentsParamsValidation = Joi.object({
  page: Joi.number().required().min(1),
  pageSize: Joi.number().min(1),
});

export const getDocumentParamsValidation = Joi.object({
  fileId: Joi.number().required().min(1),
});

export const editDocumentParamsValidation = Joi.object({
  fileId: Joi.number().required().min(1),
  label: Joi.string(),
  fileURL: Joi.string(),
});
