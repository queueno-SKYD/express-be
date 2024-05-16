import { Joi } from "express-validation";

export const addNewGroupMembersValidation = Joi.object({
  groupId: Joi.number().required(),
  members: Joi.array().items(Joi.number())
});

export const makeAdminValidation = Joi.object({
  groupId: Joi.number().required(),
  userId: Joi.number().required().min(1),
  makeAdmin: Joi.boolean().required(),
});

export const getGroupDetailsValidation = Joi.object({
  fileId: Joi.number().required().min(1),
});

export const getAllMembersValidation = Joi.object({
  groupId: Joi.number().required(),
  page: Joi.number().required().min(1),
  pageSize: Joi.number().min(1),
});
