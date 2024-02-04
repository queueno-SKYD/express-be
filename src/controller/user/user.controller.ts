import { Request, Response } from "express";
import { UserQuery } from "../../query";
import { registerValidation, searchInputValidation } from "../../validation";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import { encryptPassword } from "../../util";
import logger from "../../../logger";
import { sendRegisterationMail } from "../../services";
import JWT from "jsonwebtoken";
import env from "./../../env";

export const RegisterUser = async (req: Request, res: Response) => {
  const body = req.body;

  const { error } = registerValidation.validate(body);

  if (error) {
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message})
    );
  }

  if (body.password !== body.passwordConfirm) {
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: "Password does not match"})
    );
  }
  //#region encrypt password
  const hashedPassword = await encryptPassword(body.password);
  //#endregion

  //#region change password in save 
  const saveData = {
    ...body,
    password: hashedPassword
  }
  //#endregion
  try {
    const data = await UserQuery.save(saveData)
    /** send  Registration  mail*/
    sendRegisterationMail(data.firstName + " " + data.lastName,data.email)
    const token = JWT.sign({
      userId: data.userId
    }, env.JWT_SECRET);
    res.cookie("jwt", token, {
      // keep cookie in node.js backend
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 //1day
    })
    res.send(new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "User created", data:{userData: data, token}}));
  } catch (err: any) {
    res.status(409).send(new HTTPResponse({statusCode: HttpStatus.CONFLICT.code, httpStatus: HttpStatus.CONFLICT.status, message: err?.code === "ER_DUP_ENTRY" ? "User already exist with this email" : err.message}));
  }
  return ;
};

export const Me = async (req: Request, res: Response) => {
  const body = req.body;
  const user = res.locals.user;
  if (body?.firstName || body?.lastname || body?.imageURL) {
    const updateData = {
      firstName: body?.firstName,
      lastname: body?.lastname,
      imageUrl: body?.imageURL,
    }
    try {
      const updatedUser = await UserQuery.update(user.userId, updateData);
      return res.status(200).send(
        new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "User update success", data: updatedUser})
      );
    } catch (err: any) {
      logger.fatal(err.message)
      return res.status(500).send(
        new HTTPResponse({statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code, httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status, message: "User update failed", data: user})
      );
    }
  } else {
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "Success", data: user})
    );
  }
}

/**
 * By Kanhaiya lal 
 * Get all Users Api 
 */
export const GetAllUsers = async (req: Request, res: Response) => {
  const {pIndex} = req.body;
  const users = await UserQuery.getAllUsers(pIndex | 0);
  return res.status(200).send(
    new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "Success",data:users})
  )
}

export const SearchUsers = async (req: Request, res: Response) => {
  const body = req.body;
  const { error } = searchInputValidation.validate(body);
  if (error) {
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message})
    );
  }

  try {
    const users = await UserQuery.search(body.query);
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "Success", data: users})
    );
  } catch (err: any) {
    logger.fatal(err.message)
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: err.message, data: []})
    );
  }
}
