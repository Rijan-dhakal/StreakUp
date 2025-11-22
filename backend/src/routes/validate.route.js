import { Router } from "express";
import { validateUser } from "../controllers/validate.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const validateRouter = Router();

validateRouter.get("/user",authorize, validateUser);

export { validateRouter };