import { Request, Response } from "express";
import { UserQuery } from "../../query";
import {
  isOTPExpired,
  registerValidation,
  searchInputValidation,
} from "../../validation";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import { encryptPassword, generateOTP } from "../../util";
import logger from "../../../logger";
// import { sendRegisterationMail } from "../../services";
import JWT from "jsonwebtoken";
import env from "./../../env";
import { sendResetPasswordMail } from "../../services";
import otpQuery from "../../query/otp/otpQuery";

export const RegisterUser = async (req: Request, res: Response) => {
  const body = req.body;

  const { error } = registerValidation.validate(body);

  if (error) {
    return res.status(200).send(
      new HTTPResponse({
        statusCode: HttpStatus.WARNING.code,
        httpStatus: HttpStatus.WARNING.status,
        message: error.message,
      })
    );
  }

  if (body.password !== body.passwordConfirm) {
    return res.status(200).send(
      new HTTPResponse({
        statusCode: HttpStatus.WARNING.code,
        httpStatus: HttpStatus.WARNING.status,
        message: "Password does not match",
      })
    );
  }
  //#region encrypt password
  const hashedPassword = await encryptPassword(body.password);
  //#endregion

  //#region change password in save
  const saveData = {
    ...body,
    password: hashedPassword,
  };
  //#endregion
  try {
    const data = await UserQuery.save(saveData);
    /** send  Registration  mail*/
    // sendRegisterationMail(data.firstName + " " + data.lastName,data.email)
    const token = JWT.sign(
      {
        userId: data.userId,
      },
      env.JWT_SECRET
    );
    res.cookie("jwt", token, {
      // keep cookie in node.js backend
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //1day
    });
    res.send(
      new HTTPResponse({
        statusCode: HttpStatus.OK.code,
        httpStatus: HttpStatus.OK.status,
        message: "User created",
        data: { userData: data, token },
      })
    );
  } catch (err: any) {
    res.status(409).send(
      new HTTPResponse({
        statusCode: HttpStatus.CONFLICT.code,
        httpStatus: HttpStatus.CONFLICT.status,
        message:
          err?.code === "ER_DUP_ENTRY"
            ? "User already exist with this email"
            : err.message,
      })
    );
  }
  return;
};

export const Me = async (req: Request, res: Response) => {
  const body = req.body;
  const user = res.locals.user;
  if (body?.firstName || body?.lastname || body?.imageURL) {
    try {
      const updatedUser = await UserQuery.update(user.userId, body);
      return res.status(200).send(
        new HTTPResponse({
          statusCode: HttpStatus.OK.code,
          httpStatus: HttpStatus.OK.status,
          message: "User update success",
          data: updatedUser,
        })
      );
    } catch (err: any) {
      logger.fatal(err.message);
      return res.status(500).send(
        new HTTPResponse({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status,
          message: "User update failed",
          data: user,
        })
      );
    }
  } else {
    return res.status(200).send(
      new HTTPResponse({
        statusCode: HttpStatus.OK.code,
        httpStatus: HttpStatus.OK.status,
        message: "Success",
        data: user,
      })
    );
  }
};

/**
 * By Kanhaiya lal
 * Get all Users Api
 */
export const GetAllUsers = async (req: Request, res: Response) => {
  const { pIndex } = req.body;
  const users = await UserQuery.getAllUsers(pIndex | 0);
  return res.status(200).send(
    new HTTPResponse({
      statusCode: HttpStatus.OK.code,
      httpStatus: HttpStatus.OK.status,
      message: "Success",
      data: users,
    })
  );
};

export const SearchUsers = async (req: Request, res: Response) => {
  const body = req.body;
  const { error } = searchInputValidation.validate(body);
  if (error) {
    return res.status(200).send(
      new HTTPResponse({
        statusCode: HttpStatus.WARNING.code,
        httpStatus: HttpStatus.WARNING.status,
        message: error.message,
      })
    );
  }

  try {
    const users = await UserQuery.search(body.query);
    return res.status(200).send(
      new HTTPResponse({
        statusCode: HttpStatus.OK.code,
        httpStatus: HttpStatus.OK.status,
        message: "Success",
        data: users,
      })
    );
  } catch (err: any) {
    logger.fatal(err.message);
    return res.status(200).send(
      new HTTPResponse({
        statusCode: HttpStatus.OK.code,
        httpStatus: HttpStatus.OK.status,
        message: err.message,
        data: [],
      })
    );
  }
};

export const ForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log("body --->", email);
  if (!email) {
    res.status(200).send(
      new HTTPResponse({
        statusCode: HttpStatus.BAD_REQUEST.code,
        httpStatus: HttpStatus.BAD_REQUEST.status,
        message: "Email is required",
      })
    );
  }
  const user = await UserQuery.getUserByEmailId(email);
  if (user) {
    const userName = user.firstName + " " + user.lastName;
    const otp = generateOTP();
    const mailresponse = await sendResetPasswordMail(userName, user.email, otp);
    if (mailresponse) {
      const status = await otpQuery.insertOtpQuery(user.email, otp, "MailOtp");
      if (status) {
        res.status(200).send(
          new HTTPResponse({
            statusCode: HttpStatus.OK.code,
            httpStatus: HttpStatus.OK.status,
            message: "Otp Sent",
          })
        );
      } else {
        res.status(500).send(
          new HTTPResponse({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
            httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status,
            message: "INTERNAL_SERVER_ERROR",
          })
        );
      }
    } else {
      res.status(500).send(
        new HTTPResponse({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status,
          message: "INTERNAL_SERVER_ERROR",
        })
      );
    }
  } else {
    res.status(200).send(
      new HTTPResponse({
        statusCode: HttpStatus.BAD_REQUEST.code,
        httpStatus: HttpStatus.BAD_REQUEST.status,
        message: "User not Found !",
      })
    );
  }
};

export const VerifyOtp = async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;
  const otp_db = await otpQuery.getOtp(email);
  if (otp_db) {
    const isExpired = isOTPExpired(otp_db.createdAt, 2);
    if (isExpired) {
      res.status(200).send(
        new HTTPResponse({
          statusCode: HttpStatus.BAD_REQUEST.code,
          httpStatus: HttpStatus.BAD_REQUEST.status,
          message: "OTP Expired",
        })
      );
    } else if (otp_db && otp === otp_db.otp) {
      const hashedPassword = await encryptPassword(password);
      const isUpdated = await UserQuery.updateUserPassword(
        email,
        hashedPassword
      );
      if (isUpdated) {
        await otpQuery.deleteOtpQuery(email);
        res.status(200).send(
          new HTTPResponse({
            statusCode: HttpStatus.OK.code,
            httpStatus: HttpStatus.OK.status,
            message: "Password Updated.",
          })
        );
      } else {
        res.status(500).send(
          new HTTPResponse({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
            httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status,
            message: "INTERNAL_SERVER_ERROR",
          })
        );
      }
    }
  } else {
    res.status(200).send(
      new HTTPResponse({
        statusCode: HttpStatus.BAD_REQUEST.code,
        httpStatus: HttpStatus.BAD_REQUEST.status,
        message: "Invalid Otp !",
      })
    );
  }
};
