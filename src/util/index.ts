import * as constant from "./consts";
import { encryptPassword, comparePassword } from "./encrypt";
import JWT from "jsonwebtoken";
import env from "../env";

const checkPasswordStrength = (password: string): string[] => {
  const errors: string[] = [];

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password should contain a lowercase letter.");
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password should contain an uppercase letter.");
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password should contain a digit (number).");
  }

  if (!/(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-])/.test(password)) {
    errors.push("Password should contain a special character.");
  }

  if (password.length < 8) {
    errors.push("Password should be at least 8 characters long.");
  }

  return errors;
};

type JWTTokenType = {
  userId: number;
};

const signJWTToken = (payload: JWTTokenType): string => {
  return JWT.sign(payload, env.JWT_SECRET);
};

const generateOTP = () => {
  // Generate a random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};
export {
  generateOTP,
  constant,
  checkPasswordStrength,
  encryptPassword,
  comparePassword,
  signJWTToken,
  JWTTokenType,
};
