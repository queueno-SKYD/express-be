import { Request, Response } from "express";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import adminQuery from "../../query/admin/adminQuery";
import userQuery from "../../query/user/userQuery";

/** DeleteUserByAdmin 
 * By Kanhaiya Lal
 */
export const DeleteUserByAdmin = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;
    const user = res.locals.user;
    if(user.userId == userIds[0]){
      return res.status(400).send(
        new HTTPResponse({
          statusCode: HttpStatus.UN_AUTHORISED.code,
          httpStatus: HttpStatus.UN_AUTHORISED.status,
          message: "Can't delete your own id!",
          data: null,
        })
      );
    }
    if (user.userType == 0) {
      return res.status(401).send(
        new HTTPResponse({
          statusCode: HttpStatus.UN_AUTHORISED.code,
          httpStatus: HttpStatus.UN_AUTHORISED.status,
          message: "Access Denied!",
          data: null,
        })
      );
    }
    if (!userIds && userIds.length == 0) {
      return res.status(400).send(
        new HTTPResponse({
          statusCode: HttpStatus.BAD_REQUEST.code,
          httpStatus: HttpStatus.BAD_REQUEST.status,
          message: "Users not Selected!",
          data: null,
        })
      );
    }

    const result = await adminQuery.deleteUsersByAdmin(user.userId, userIds);
    if (result) {
      return res.status(200).send(
        new HTTPResponse({
          statusCode: HttpStatus.OK.code,
          httpStatus: HttpStatus.OK.status,
          message: "User SuccessFully deleted",
          data: userIds,
        })
      );
    } else {
      return res.status(502).send(
        new HTTPResponse({
          statusCode: HttpStatus.DATABASE_ERROR.code,
          httpStatus: HttpStatus.DATABASE_ERROR.status,
          message: "[Error] : database Error",
          data: null,
        })
      );
    }
  } catch (error) {
    console.log("Error ---->", error);
    return res.status(500).send(
      new HTTPResponse({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status,
        message: "Internal Server Error!",
        data: null,
      })
    );
  }
};

export const EditUserByAdmin = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, imageURL, userId } = req.body;
    const user = res.locals.user;
    if (user.userType == 0) {
      return res.status(401).send(
        new HTTPResponse({
          statusCode: HttpStatus.UN_AUTHORISED.code,
          httpStatus: HttpStatus.UN_AUTHORISED.status,
          message: "Access Denied!",
          data: null,
        })
      );
    }
    const result = await userQuery.update(userId, {firstName:firstName, lastName:lastName, imageURL:imageURL});
    if (result) {
      return res.status(200).send(
        new HTTPResponse({
          statusCode: HttpStatus.OK.code,
          httpStatus: HttpStatus.OK.status,
          message: "User SuccessFully updated",
          data: [userId],
        })
      );
    } else {
      return res.status(502).send(
        new HTTPResponse({
          statusCode: HttpStatus.DATABASE_ERROR.code,
          httpStatus: HttpStatus.DATABASE_ERROR.status,
          message: "[Error] : database Error",
          data: null,
        })
      );
    }
  } catch (error) {
    // console.log("Error ---->", error);
    return res.status(500).send(
      new HTTPResponse({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status,
        message: "Internal Server Error!",
        data: null,
      })
    );
  }
};
