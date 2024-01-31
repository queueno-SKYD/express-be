import { Request, Response } from "express";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import adminQuery from "../../query/admin/adminQuery";

/** DeleteUserByAdmin 
 * By Kanhaiya Lal
 */
export const DeleteUserByAdmin = async (req: Request, res: Response) => {
  
  try {
    const {userIds} = req.body;
    const user = res.locals.user;
    console.log("userIds- ---- >", userIds)
    if (user.userType == 0) {
      return res.status(200).send(
        new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "You can't User Delete , This Permission only For admin"})
      )
    }
    if (!userIds && userIds.length == 0) {
      return res.status(200).send(
        new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "Users not Selected!"})
      )
    }
  
    const result = await adminQuery.deleteUsersByAdmin(user.userId, userIds);
    if (result) {
      return res
        .status(200)
        .send(
          new HTTPResponse({
            statusCode: HttpStatus.OK.code,
            httpStatus: HttpStatus.OK.status,
            message: "User SuccessFully deleted",
          })
        );
    } else {
      return res
        .status(502)
        .send(
          new HTTPResponse({
            statusCode: HttpStatus.DATABASE_ERROR.code,
            httpStatus: HttpStatus.DATABASE_ERROR.status,
            message: "[Error] : database Error",
          })
        );
    }
  } catch (error) {
    console.log("Error ---->", error);
    return res
      .status(500)
      .send(
        new HTTPResponse({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
          httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status,
          message: "Internal Server Error!",
        })
      );
  }
  
}
