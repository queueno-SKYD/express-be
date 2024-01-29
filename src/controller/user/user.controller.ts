import { Request, Response } from "express";
import { UserQuery } from "../../query";
import { registerValidation } from "../../validation";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import { encryptPassword } from "../../util";
import { sendRegisterationMail } from "../../services";

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
  const data = await UserQuery.save(saveData)
  res.send(new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "User created", data}));
  /** send  Registration  mail*/
  sendRegisterationMail(data.firstName + " " + data.lastName,data.email) 
  return ;
};

export const Me = async (_: Request, res: Response) => {
  const user = res.locals.user;
  return res.status(200).send(
    new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "Success", data: user})
  );
}
export const NotFound = async (_: Request, res: Response) => {
  return res.status(404).send(
    new HTTPResponse({statusCode: HttpStatus.NOT_FOUND.code, httpStatus: HttpStatus.NOT_FOUND.status, message: "Not Found"})
  );
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
