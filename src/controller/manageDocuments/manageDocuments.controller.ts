import { Request, Response } from "express";
import { DocumentQuery } from "../../query";
import { createDocumentValidation, editDocumentParamsValidation, getDocumentParamsValidation, getDocumentsParamsValidation } from "../../validation";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import logger from "../../../logger";
import { FileDatabase } from "../../model/documentModel";

const getTypeEnum = (fileTypeString: string): FileDatabase => {
  const firstLetter = fileTypeString?.toLowerCase?.()?.[0] || "null";
  switch (firstLetter) {
  case "i":
    return FileDatabase.imagesTable
  case "v":
    return FileDatabase.mediaTable
  default:
    return FileDatabase.documentTable
  }
}

export const UploadDocument = async (req: Request, res: Response) => {
  const body = req.body;
  const userDetails = res.locals.user;

  const { error } = createDocumentValidation.validate(body);

  if (error) {
    logger.fatal(error, "input field validation error")
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message})
    );
  }
  //#region encrypt password
  //#endregion

  try {
    const data = await DocumentQuery.save(userDetails.userId, body, FileDatabase.documentTable);
    logger.info(data, "document created")
    res.send(new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "Document uploaded successfully", data}));
  } catch (err: any) {
    res.status(500).send(new HTTPResponse({statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code, httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status, message: "ERROR: Document NOT uploaded, try after some time", data: err.message}));
  }
  return ;
};

export const GetDocuments = async (req: Request, res: Response) => {
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
    const type = getTypeEnum(body.fileType)
    const data = await DocumentQuery.getDocuments(userDetails.userId, body.page, type ,body.pageSize);
    res.send(new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "success", data}));
  } catch (err: any) {
    res.status(500).send(new HTTPResponse({statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code, httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status, message: "ERROR: Document NOT uploaded, try after some time", data: err.message}));
  }
  return ;
};

export const GetDocument = async (req: Request, res: Response) => {
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
    const type = getTypeEnum(body.fileType)
    const data = await DocumentQuery.getDocument(body.fileId, userDetails.userId, type);
    res.send(new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "success", data}));
  } catch (err: any) {
    res.status(500).send(new HTTPResponse({statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code, httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status, message: "ERROR: Document NOT uploaded, try after some time", data: err.message}));
  }
  return ;
};

export const DeleteDocument = async (req: Request, res: Response) => {
  const userDetails = res.locals.user;
  const body = req.body
  //#region validate input
  const { error } = getDocumentParamsValidation.validate(body); // same for delete

  if (error) {
    logger.fatal(error, "input field validation error")
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message})
    );
  }
  //#endregion

  try {
    const type = getTypeEnum(body.fileType)
    const data = await DocumentQuery.deleteDocument(body.fileId, userDetails.userId, userDetails.userId, type);
    res.send(new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "success", data}));
  } catch (err: any) {
    res.status(500).send(new HTTPResponse({statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code, httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status, message: "ERROR: Document NOT uploaded, try after some time", data: err.message}));
  }
  return ;
};

export const EditDocument = async (req: Request, res: Response) => {
  const userDetails = res.locals.user;
  const body = req.body
  //#region validate input
  const { error } = editDocumentParamsValidation.validate(body); // same for delete

  if (error) {
    logger.fatal(error, "input field validation error")
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message: error.message})
    );
  }
  //#endregion

  try {
    const type = getTypeEnum(body.fileType)
    const data = await DocumentQuery.update(userDetails.userId, body, type);
    res.send(new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "success", data}));
  } catch (err: any) {
    res.status(500).send(new HTTPResponse({statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code, httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status, message: "ERROR: Document NOT uploaded, try after some time", data: err.message}));
  }
  return ;
};
