import express, { Router } from "express";
import { userRegisterController} from "../controllers/userController";
import { user_register_schema,  } from "../validators/user";
import { validateSchema } from "../utils/validator";

export const userRoute = (): Router => {
  const router = express.Router();
  router.post('/register', validateSchema(user_register_schema, 'body'), userRegisterController);

  return router;
};
