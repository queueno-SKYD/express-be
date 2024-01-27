import { Router } from "express";
import { RegisterUser } from "./controller";

export const routes = (router: Router) => {
  router.post("/api/register", RegisterUser);
};

