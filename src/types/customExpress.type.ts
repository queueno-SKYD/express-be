import { Request, Response } from "express";
import UserModel from "../model/userModel";

export interface CustomResponse extends Response {
  user?: UserModel; // Replace 'any' with your actual user type
}

export interface CustomRequest extends Request {
  user?: UserModel; // Replace 'any' with your actual user type
}
