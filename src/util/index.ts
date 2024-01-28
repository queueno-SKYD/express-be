
export const validatePassword = (
  originalPassword: string,
  userPassword: string
) => {
  return originalPassword === userPassword;
};
