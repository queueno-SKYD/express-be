import { Response, Request } from "express";
import { RegisterUser, Me } from "./user/user.controller";
import { Login } from "./auth/auth.controller";
import { HTTPResponse, HttpStatus } from "./../httpResponse";

const NotFound = async (_: Request, res: Response) => {
  return res.status(404).send(
    new HTTPResponse({statusCode: HttpStatus.NOT_FOUND.code, httpStatus: HttpStatus.NOT_FOUND.status, message: "Not Found"})
  );
}

export {
  RegisterUser,
  Login,
  Me,
  NotFound
};
