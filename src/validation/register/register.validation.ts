import { Joi } from "express-validation";
import { constant } from "./../../util";

export const registerValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().regex(constant.PASSWORD_REGEX).required(),
  passwordConfirm: Joi.string().required(),
  userType: Joi.number().max(1).min(0),
});

export const searchInputValidation = Joi.object({
  query: Joi.string().allow(""),
});
