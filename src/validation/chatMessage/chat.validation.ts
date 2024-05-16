import { Joi } from "express-validation";

export const personalChatMessageValidation = Joi.object({
  message: Joi.string().required(),
  sendAt: Joi.date().required(),
  recipientId: Joi.number().required(),
});
