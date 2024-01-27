import { Request, Response } from "express";
import { registerValidation } from "../../validation";

export const RegisterUser = (req: Request, res: Response) => {
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
  res.send({request: req.body, msg: msg});
  return ;
};
