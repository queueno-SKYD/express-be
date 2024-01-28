import { Router } from "express";
import { RegisterUser, Login } from "../controller";
import { PathName } from "./pathName";
import { UserAuthenticate } from "../middleware";
export const routes = (router: Router) => {
  router.post(PathName.Register, RegisterUser);
  router.post(PathName.Login, UserAuthenticate, Login);
};
