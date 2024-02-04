import { Request, Response } from "express";
import { ShareDocumentQuery, DocumentQuery } from "../../query";
import { shareDocumentValidation, getDocumentParamsValidation, getDocumentsParamsValidation } from "../../validation";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import logger from "../../../logger";

export const ShareDocument = async (req: Request, res: Response) => {
  const body = req.body;
  const userDetails = res.locals.user;

  const { error } = shareDocumentValidation.validate(body);

  if (error) {
    logger.fatal(error, "input field validation error")
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message})
    );
  }
  //#region encrypt password
  //#endregion

  try {
    const document = await DocumentQuery.getDocument(body.fileId, userDetails.userId);
    if (!document.fileId) {
      res.status(400).send(new HTTPResponse({statusCode: HttpStatus.BAD_REQUEST.code, httpStatus: HttpStatus.BAD_REQUEST.status, message: "You are not the owner", data: null}));
    }
    const data = await ShareDocumentQuery.share(document.fileId, body);
    logger.info(data, "document created")
    res.send(new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "Document uploaded successfully", data}));
  } catch (err: any) {
    res.status(400).send(new HTTPResponse({statusCode: HttpStatus.BAD_REQUEST.code, httpStatus: HttpStatus.BAD_REQUEST.status, message: err.message, data: null}));
  }
  return ;
};

export const GetShareDetails = async (req: Request, res: Response) => {
  const userDetails = res.locals.user;
  const body = req.body;
  //#region validate input
  const { error } = getDocumentsParamsValidation.validate(body);

  if (error) {
    logger.fatal(error, "input field validation error")
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message})
    );
  }
  //#endregion

  try {
    const data = await DocumentQuery.getDocuments(userDetails.userId, body.page, body.pageSize);
    res.send(new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "success", data}));
  } catch (err: any) {
    res.status(500).send(new HTTPResponse({statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code, httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status, message: "ERROR: Document NOT uploaded, try after some time", data: err.message}));
  }
  return ;
};

export const RevokeAccess = async (req: Request, res: Response) => {
  const userDetails = res.locals.user;
  const body = req.body
  //#region validate input
  const { error } = getDocumentParamsValidation.validate(body);

  if (error) {
    logger.fatal(error, "input field validation error")
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message})
    );
  }
  //#endregion

  try {
    const data = await DocumentQuery.getDocument(body.fileId, userDetails.userId);
    res.send(new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "success", data}));
  } catch (err: any) {
    res.status(500).send(new HTTPResponse({statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code, httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status, message: "ERROR: Document NOT uploaded, try after some time", data: err.message}));
  }
  return ;
};
