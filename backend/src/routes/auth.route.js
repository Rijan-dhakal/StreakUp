import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);

export {authRouter}