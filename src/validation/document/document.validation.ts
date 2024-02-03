import { Joi } from "express-validation";

export const createDocumentValidation = Joi.object({
  fileName: Joi.string().required(),
  fileURL: Joi.string(),
});

export const getDocumentsParamsValidation = Joi.object({
  page: Joi.number().required().min(1),
  pageSize: Joi.number().min(1),
});

export const getDocumentParamsValidation = Joi.object({
  fileId: Joi.number().required().min(1),
});
