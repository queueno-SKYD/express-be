import { Request, Response } from "express";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import { addNewGroupMembersValidation, makeAdminValidation } from "../../validation";
import { ChatGroupMememberQuery} from "../../query";

export const AddMembers = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user = res.locals.user;
    //#region verify payload
    const { error } = addNewGroupMembersValidation.validate(body);
    if (error) {
      return res.status(200).send(
        new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message})
      );
    }
    //#endregion
  
    //#region check if admin then add new members
    const isAdmin = await ChatGroupMememberQuery.isAdmin(body?.groupId, user?.userId)
    if (!isAdmin) {
      return res.status(400).send(
        new HTTPResponse({
          statusCode: HttpStatus.BAD_REQUEST.code,
          httpStatus: HttpStatus.BAD_REQUEST.status,
          message: "Only admin can add new members",
          data: null,
        })
      );
    }
    const members = body?.members?.map((id: number) => {
      return {
        userId: id,
        isAdmin: false
      }
    })
    const result = await ChatGroupMememberQuery.saveAll(body?.groupId, members);
    if (result) {
      return res.status(200).send(
        new HTTPResponse({
          statusCode: HttpStatus.OK.code,
          httpStatus: HttpStatus.OK.status,
          message: "Members added",
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

export const MakeAdmin = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user = res.locals.user;
    //#region verify payload
    const { error } = makeAdminValidation.validate(body);
    if (error) {
      return res.status(200).send(
        new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message})
      );
    }
    //#endregion
    //#region make admin
    const isAdmin = await ChatGroupMememberQuery.isAdmin(body?.groupId, user?.userId)
    if (!isAdmin) {
      return res.status(400).send(
        new HTTPResponse({
          statusCode: HttpStatus.BAD_REQUEST.code,
          httpStatus: HttpStatus.BAD_REQUEST.status,
          message: "Only admin can make new admin",
          data: null,
        })
      );
    }
    const result = await ChatGroupMememberQuery.makeAdmin(body?.groupId, body?.userId, body?.makeAdmin);
    if (result) {
      return res.status(200).send(
        new HTTPResponse({
          statusCode: HttpStatus.OK.code,
          httpStatus: HttpStatus.OK.status,
          message: "OK",
          data: result,
        })
      );
    } else {
      return res.status(502).send(
        new HTTPResponse({
          statusCode: HttpStatus.DATABASE_ERROR.code,
          httpStatus: HttpStatus.DATABASE_ERROR.status,
          message: "[Error] : not a member",
          data: null,
        })
      );
    }
    //#endregion
  } catch (error) {
    console.log("Error ---->", error);
    return res.status(400).send(
      new HTTPResponse({
        statusCode: HttpStatus.BAD_REQUEST.code,
        httpStatus: HttpStatus.BAD_REQUEST.status,
        message: "Internal Server Error!",
        data: error,
      })
    );
  }
};

