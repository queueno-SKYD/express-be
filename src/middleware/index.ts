import { NextFunction, Request, Response } from "express";
import { HTTPResponse, HttpStatus } from "../httpResponse";
import { UserQuery } from "../query";
import { comparePassword } from "../util";
// import logger from "../../logger";

export const UserAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  const {email,password} = req.body;
  UserQuery.getUser(0, email).then(async (response) => {
    if (response) {
      if (await comparePassword(password, response.password)) {
        next();
      } else {
        res.status(200).send(
          new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.WARNING.status, message: "Invalid Password!"})
        );
      }
    }
  }).catch((err) => {
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message:err})
    );
  })
}
