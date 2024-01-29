import env from "../../env";
import nodemailer from "nodemailer";
interface mailDetails {
  from: string; // sender address
  to: string; // receiver email
  subject: string; // Subject line
  text: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: env.GMAIL,
    pass: env.GMAIL_PASSWORD,
  },
});

const sendMail = async (mailDetails: mailDetails, callback) => {
  try {
    const info = await transporter.sendMail(mailDetails);
    callback(info);
  } catch (error) {
    console.log(error);
  }
};

export default sendMail;
