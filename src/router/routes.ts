import { Router } from "express";
import { RegisterUser, Login, Me, NotFound } from "../controller";
import { PathName } from "./pathName";

export const routes = (router: Router) => {
  router.post(PathName.Register, RegisterUser);
  router.post(PathName.Login, Login);
  router.post(PathName.Me, Me);
  router.all(PathName.NotFound,NotFound )
};
                                                                                                                                           