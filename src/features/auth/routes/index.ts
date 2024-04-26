import express, { Response, Request } from "express";
import signUpController from "../controllers/signupController";
import { validate } from "../middlewares/validate";
import { signupSchema } from "../validation/signUp";

const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signUpController);

export { authRouter };
