import { Request, Response } from "express";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import { groupChatMessageValidations } from "../../validation";
import { GroupMessageModalQuery} from "../../query";

export const GetMessageById = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user = res.locals.user;
    //#region verify payload
    const { error } = groupChatMessageValidations.getGroupMessageById.validate(body);
    if (error) {
      return res.status(200).send(
        new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message})
      );
    }
    //#endregion
    //#region get message by message id
    const result = await GroupMessageModalQuery.get(user.userId, body.groupId, body.messageId);
    if (result) {
      return res.status(HttpStatus.OK.code).send(
        new HTTPResponse({
          statusCode: HttpStatus.OK.code,
          httpStatus: HttpStatus.OK.status,
          data: result,
        })
      );
    } else {
      return res.status(HttpStatus.NO_CONTENT.code).send(
        new HTTPResponse({
          statusCode: HttpStatus.NO_CONTENT.code,
          httpStatus: HttpStatus.NO_CONTENT.status,
          message: "record not found",
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

export const GetGroupMessages = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user = res.locals.user;
    //#region verify payload
    const { error } = groupChatMessageValidations.getGroupMessages.validate(body);
    if (error) {
      return res.status(200).send(
        new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message})
      );
    }
    //#endregion
    //#region get all message by groupId and userId
    const result = await GroupMessageModalQuery.getGroupMessages(body?.groupId, user?.userId, body?.page, body?.pageSize);
    if (result) {
      return res.status(HttpStatus.OK.code).send(
        new HTTPResponse({
          statusCode: HttpStatus.OK.code,
          httpStatus: HttpStatus.OK.status,
          data: result,
        })
      );
    } else {
      return res.status(HttpStatus.NO_CONTENT.code).send(
        new HTTPResponse({
          statusCode: HttpStatus.NO_CONTENT.code,
          httpStatus: HttpStatus.NO_CONTENT.status,
          message: "record not found",
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

