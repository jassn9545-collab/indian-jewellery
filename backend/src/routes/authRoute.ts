import express, { Router } from "express";
import { authLogin } from "../controllers/authController";
import { auth_login_schema } from "../validators/auth";
import { validateSchema } from "../utils/validator";

export const authRoute = (): Router => {
  const router = express.Router();
  router.post("/login", validateSchema(auth_login_schema, 'body'), authLogin);
  // router.put("/logout", validateSchema(auth_login_schema, 'body'), authLogin);

  return router;
};