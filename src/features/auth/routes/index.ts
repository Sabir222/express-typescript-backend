import express, { Response, Request } from "express";
import { validate } from "../middlewares/validate";
import { loginSchema } from "../validation/login";
import { signupSchema } from "../validation/signUp";
import loginController from "../controllers/loginController";
import signUpController from "../controllers/signupController";
import meController from "../controllers/meController";
import logoutController from "../controllers/logoutController";
import refreshController from "../controllers/refreshController";

loginController;
const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signUpController);
authRouter.post("/login", validate(loginSchema), loginController);
authRouter.get("/me", meController);
authRouter.get("/logout", logoutController);
authRouter.get("/refresh", refreshController);

export { authRouter };
