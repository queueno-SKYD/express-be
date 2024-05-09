import { Request, Response } from "express";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import multer from "multer";
import path from "path";
import fs from "fs";
import { DocumentQuery } from "../../query";
import { FileDatabase, FileTypes } from "../../model/documentModel";
import logger from "../../../logger";
// import { uploadfileValidation } from "../../validation";

enum filePathEnum {
  other= "other",
  users= "users",
  groups= "groups",
  uploads= "uploads"
}

enum mimeTypeEnum {
  image= "image/",
  video= "video/",
}

enum fileTypeEnum {
  images= "images",
  videos= "videos",
  others= "others",
}
// const storage2 = multer.diskStorage({
//   destination: function (_, __, cb) {
//     cb(null, "uploads")
//   },
//   filename: function (_, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + "-" + uniqueSuffix)
//   }
// })

const storage = multer.diskStorage({
  destination: function (_, file, cb) {
    const maxSize = file.mimetype.startsWith(mimeTypeEnum.image) ? 400 * 1024 : 10 * 1024 * 1024; // 400KB for images, 10MB for others

    if (file.size > maxSize) {
      return cb(
        new Error("File size exceeds the limit"), ""
      );
    }
    const fileType = file.mimetype.startsWith(mimeTypeEnum.image)
      ? fileTypeEnum.images
      : file.mimetype.startsWith(mimeTypeEnum.video)
        ? fileTypeEnum.videos
        : fileTypeEnum.others;
    const basePath = path.join(filePathEnum.uploads, fileType);
    fs.access(basePath, fs.constants.F_OK, (err) => {
      if (err) {
        // Directory does not exist, create it
        fs.mkdir(basePath, { recursive: true }, (err) => {
          if (err) {
            return cb(err, "");
          }
          cb(null, basePath);
        });
      } else {
        // Directory exists, proceed with saving the file
        cb(null, basePath);
      }
    });
  },
  filename: function (_, file, cb) {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "user_upload_" + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage });

export const uploadFile = (req: Request, res: Response): void => {
  try {
    upload.array("files[]")(req, res, async (err: any) => {
      const bodyParams = JSON.parse(req.body.params || "{}");
      console.debug(req.files)
      logger.info(bodyParams, "bodyParams")
      const user = res.locals.user;
      if (err) {
        return res.status(500).send(
          new HTTPResponse({statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code, httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status, message: "Error uploading image", data: null})
        );
      }
      // Here you can save the file path to a database or perform other logic
      let fileUploadResponse = {};
      let fileType: FileTypes = FileTypes.image;
      if (req.files?.[0].path) {
        switch (true) {
        case req.files?.[0]?.mimetype?.startsWith("image/"):
          // Handle image files
          fileType = FileTypes.image;
          fileUploadResponse = await DocumentQuery.save(
            user.userId,
            {
              name: req.files?.[0]?.originalname,
              fileURL: req.files?.[0]?.path,
              label: bodyParams?.label || req.files?.[0]?.originalname,
              mimeType: req.files?.[0]?.mimetype,
            },
            FileDatabase.imagesTable
          )
          break;
        case req.files?.[0]?.mimetype?.startsWith("video/"):
          fileType = FileTypes.media;
          fileUploadResponse = await DocumentQuery.save(user.userId, {
            name: req.files?.[0]?.originalname,
            fileURL: req.files?.[0]?.path,
            label: bodyParams?.label || req.files?.[0]?.originalname,
            mimeType: req.files?.[0]?.mimetype,
          }, FileDatabase.mediaTable)
          break;
        default:
          console.debug("data", {
            name: req.files?.[0]?.originalname,
            fileURL: req.files?.[0]?.path,
            label: bodyParams?.label || req.files?.[0]?.originalname,
            mimeType: req.files?.[0]?.mimetype,
          });
          fileType = FileTypes.document;
          fileUploadResponse = await DocumentQuery.save(user.userId, {
            name: req.files?.[0]?.originalname,
            fileURL: req.files?.[0]?.path,
            label: bodyParams?.label || req.files?.[0]?.originalname,
            mimeType: req.files?.[0]?.mimetype,
          }, FileDatabase.documentTable)
          break;
        }
        return res.status(200).send(
          new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: `${fileType} uploaded successfully`, data: fileUploadResponse})
        );
      } else {
        return res.status(500).send(
          new HTTPResponse({statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code, httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status, message: "Uploaded path not found", data: null})
        );
      }
    });

  } catch (err: any) {
    res.status(400).send(
      new HTTPResponse({statusCode: HttpStatus.BAD_REQUEST.code, httpStatus: HttpStatus.BAD_REQUEST.status, message: err?.message, data: null})
    );
  }
};
