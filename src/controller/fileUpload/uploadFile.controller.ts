import { Request, Response } from "express";
import { HTTPResponse, HttpStatus } from "../../httpResponse";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, "uploads")
  },
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + "-" + uniqueSuffix)
  }
})

const upload = multer({ storage: storage });

export const uploadFile = (req: Request, res: Response): void => {
  try {
    upload.single("image")(req, res, (err: any) => {
      if (err) {
        return res.status(500).send(
          new HTTPResponse({statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code, httpStatus: HttpStatus.INTERNAL_SERVER_ERROR.status, message: "Error uploading image", data: null})
        );
      }
      // Here you can save the file path to a database or perform other logic
      return res.status(200).send(
        new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message: "Image uploaded successfully", data: req.file})
      );
    });

  } catch (err: any) {
    res.status(400).send(
      new HTTPResponse({statusCode: HttpStatus.BAD_REQUEST.code, httpStatus: HttpStatus.BAD_REQUEST.status, message: err?.message, data: null})
    );
  }
};
