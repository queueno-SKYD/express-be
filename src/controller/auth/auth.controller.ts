import { Request, Response } from "express";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import { comparePassword } from "../../util";
import { UserQuery } from "../../query";
import logger from "../../../logger";
import JWT from "jsonwebtoken";
import env from "./../../env";

export const Login = (req: Request, res: Response) => {
  const {email, password} = req.body;
  UserQuery.getUser(0, email).then(async (response) => {
    if (response) {
      if (await comparePassword(password, response.password)) {
        // #region add JWT token
        const token = JWT.sign({
          userId: response.userId
        }, env.JWT_SECRET);
        res.cookie("jwt", token, {
          // keep cookie in node.js backend
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000 //1day
        })
        return res.status(200).send(
          new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message:"User Successfuly Login", data: {token}})
        );
        // #endregion
      } else {
        return res.status(200).send(
          new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.WARNING.status, message: "Invalid Password!"})
        );
      }
    } else {
      logger.fatal("User not found in DB")
      return res.status(200).send(
        new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.WARNING.status, message: "Invalid user"})
      );
    }
  }).catch((err) => {
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message:err})
    );
  })
};
