import { NextFunction, Request, Response } from "express";
import { HTTPResponse, HttpStatus } from "../httpResponse";
import { UserQuery } from "../query";
import { PublicRoute } from "../router";
import JWT from "jsonwebtoken";
import env from "../env";
import logger from "../../logger";

export const UserAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  const isPublicRoute = PublicRoute.includes(path)
  if (isPublicRoute) {
    next()
    return;
  }
  const token = req.header("Authorization");
  if (!token) {
    logger.fatal("Token not found")
    return res.status(401).send(
      new HTTPResponse({statusCode: HttpStatus.UN_AUTHORISED.code, httpStatus: HttpStatus.UN_AUTHORISED.status, message: "Unauthorised! access"})
    );
  } 
  try {
    logger.info({token}, "Token found")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = JWT.verify(token, env.JWT_SECRET); // Replace 'your-secret-key' with your actual secret key
    const userId = payload?.userId;
    logger.info(userId, "user id from token")
    if (userId) {
      // Attach user details to the request object
      UserQuery.getUser(userId, "").then(async (response) => {
        res.locals.user = response;
        next()
      }).catch((err) => {
        return res.status(200).send(
          new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message:err})
        );
      })
    } else {
      logger.fatal("Invalid token")
      return res.status(401).send(
        new HTTPResponse({statusCode: HttpStatus.UN_AUTHORISED.code, httpStatus: HttpStatus.UN_AUTHORISED.status, message: "ERROR: User unauthenticated!"})
      )
    }
    return;
  } catch (error) {
    return res.status(401).send(
      new HTTPResponse({statusCode: HttpStatus.UN_AUTHORISED.code, httpStatus: HttpStatus.UN_AUTHORISED.status, message: "Unauthorized: Invalid token", data: error})
    )
  }
}
