import * as constant from "./consts";
import { encryptPassword, comparePassword } from "./encrypt";

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
}

export {
  constant,
  checkPasswordStrength,
  encryptPassword,
  comparePassword,
};
