import { Joi } from "express-validation";

export const createDocumentValidation = Joi.object({
  label: Joi.string().required(),
  fileURL: Joi.string().required(),
});

export const getDocumentsParamsValidation = Joi.object({
  fileType: Joi.string(),
  page: Joi.number().required().min(1),
  pageSize: Joi.number().min(1),
});

export const getDocumentParamsValidation = Joi.object({
  fileType: Joi.string(),
  fileId: Joi.number().required().min(1),
});

export const editDocumentParamsValidation = Joi.object({
  fileType: Joi.string(),
  fileId: Joi.number().required().min(1),
  label: Joi.string(),
  fileURL: Joi.string(),
});

export const uploadfileValidation = Joi.object({
  name: Joi.string().allow(""),
  file: Joi.any().required(), // Assuming file is handled by Multer and is available in req.file
  groupId: Joi.number(),
});
