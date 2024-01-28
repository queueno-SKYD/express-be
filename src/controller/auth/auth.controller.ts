import { Request, Response } from "express";
import { HTTPResponse, HttpStatus } from "../../httpResponse";

export const Login = (_: Request, res: Response) => {
  return res.status(200).send(
    new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message:"User Successfuly Login"})
  );
};
