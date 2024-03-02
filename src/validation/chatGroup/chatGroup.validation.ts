import { Joi } from "express-validation";

export const createGroupValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  profileImageUrl: Joi.string(),
  members: Joi.array().items(Joi.number())
});

export const getGroupsValidation = Joi.object({
  page: Joi.number().required().min(1),
  pageSize: Joi.number().min(1),
});

export const getGroupDetailsValidation = Joi.object({
  fileId: Joi.number().required().min(1),
});

export const editGroupValidation = createGroupValidation.keys({
  id: Joi.number().required()
});
