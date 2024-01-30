import env from "../env"
import sendMail from "./mail/emailService"
import { RegisterSuccussMail } from "./mail/mailformat"

export const sendRegisterationMail = (userName: string, MailId: string) => {
  try {
    sendMail({
      to:MailId,
      from :env.GMAIL,
      subject :"Your Registration Successful",
      text :"",
      html : RegisterSuccussMail("Skyd",userName)
    },() => {
      console.log("Send")
    })
  } catch (error) {
    console.log("Error ---> ",error)
  }
  
}
export const sendVerifyMail = (userName: string, MailId: string ) => {
  sendMail({
    to:MailId,
    from :env.GMAIL,
    subject :"Your Registration Successful",
    text :"",
    html : RegisterSuccussMail("Skyd",userName)
  },() => {
    console.log("Send")
  })
}
