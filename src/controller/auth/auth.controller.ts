import { Request, Response } from "express";
import { UserQuery } from "../../query";
import { HTTPResponse, HttpStatus } from "../../httpResponse";

export const Login = (req: Request, res: Response) => {
  const {email} = req.body;
  UserQuery.getUser(0,email).then((response)=>{
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.OK.code, httpStatus: HttpStatus.OK.status, message:"User Successfuly Login",data:response})
    );
  }).catch((err)=>{
    return res.status(200).send(
      new HTTPResponse({statusCode: HttpStatus.WARNING.code, httpStatus: HttpStatus.WARNING.status, message:err})
    );
  })
  
};
