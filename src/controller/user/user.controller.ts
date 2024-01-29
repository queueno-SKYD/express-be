import { Request, Response } from "express";
import { UserQuery } from "../../query";
import { registerValidation } from "../../validation";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import { encryptPassword } from "../../util";
import logger from "../../../logger";

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
    res.send(new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "User created", data}));
  } catch (err: any) {
    res.status(409).send(new HTTPResponse({statusCode: HttpStatus.CONFLICT.code, httpStatus: HttpStatus.CONFLICT.status, message: "ERROR: User not created", data: err?.code === "ER_DUP_ENTRY" ? "User already exist with this email" : err.message}));
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
