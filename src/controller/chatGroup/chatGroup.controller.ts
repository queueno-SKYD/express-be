import { Request, Response } from "express";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import { createGroupValidation } from "../../validation";
import { ChatGroupQuery} from "../../query";

export const CreateGroup = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user = res.locals.user;
    //#region verify payload
    const { error } = createGroupValidation.validate(body);
    if (error) {
      return res.status(200).send(
        new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message})
      );
    }
    //#endregion
    //#region create new group
    const result = await ChatGroupQuery.save(user.userId, body);
    if (result) {
      return res.status(200).send(
        new HTTPResponse({
          statusCode: HttpStatus.OK.code,
          httpStatus: HttpStatus.OK.status,
          message: "Group SuccessFully deleted",
          data: result,
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
    //#endregion
  } catch (error) {
    console.log("Error ---->", error);
    return res.status(500).send(
      new HTTPResponse({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status,
        message: "Internal Server Error!",
        data: error,
      })
    );
  }
};

