import { Joi } from "express-validation";

export const getGroupMessageById = Joi.object({
  messageId: Joi.number().required().min(1),
  groupId: Joi.number().min(1),
});

export const getGroupMessages = Joi.object({
  groupId: Joi.number().required().min(1),
  page: Joi.number().required().min(1),
  pageSize: Joi.number().min(1),
});
