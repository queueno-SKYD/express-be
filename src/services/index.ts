import env from "../env";
import sendMail from "./mail/emailService";
import { RegisterSuccussMail, ResetPasswordMail } from "./mail/mailformat";

export const sendRegisterationMail = (userName: string, MailId: string) => {
  try {
    sendMail({
      to: MailId,
      from: env.GMAIL,
      subject: "Your Registration Successful",
      text: "",
      html: RegisterSuccussMail("Skyd", userName),
    });
  } catch (error) {
    console.log("Error ---> ", error);
  }
};
export const sendVerifyMail = (userName: string, MailId: string) => {
  sendMail({
    to: MailId,
    from: env.GMAIL,
    subject: "Your Registration Successful",
    text: "",
    html: RegisterSuccussMail("Skyd", userName),
  });
};

export const sendResetPasswordMail = async (
  userName: string,
  MailId: string,
  otp: number
) => {
  const res = await sendMail({
    to: MailId,
    from: env.GMAIL,
    subject: "Reset Password",
    text: "",
    html: ResetPasswordMail("Skyd", userName, otp),
  });
  return res;
};
