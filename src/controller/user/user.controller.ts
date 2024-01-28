import { Request, Response } from "express";
import { UserQuery } from "../../query";
import { registerValidation } from "../../validation";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import { encryptPassword } from "../../util";

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
  return ;
};
