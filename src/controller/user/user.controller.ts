import { Request, Response } from "express";
import { UserQuery } from "../../query";
import { registerValidation } from "../../validation";

export const RegisterUser = async (req: Request, res: Response) => {
  const msg = "Bhai ho gya pass";
  const body = req.body;

  const { error } = registerValidation.validate(body);

  if (error) {
    return res.status(400).send(error.details);
  }

  if (body.password !== body.passwordConfirm){
    return res.status(400).send({
      message: "ERROR :: Passwords do not match!"
    });
  }
  const data = await UserQuery.save(body)
  res.send({request: data, msg: msg});
  return ;
};
