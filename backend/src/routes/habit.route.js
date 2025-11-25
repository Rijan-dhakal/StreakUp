import { Router } from "express";
import { addHabit } from "../controllers/habit.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const habitRouter = Router();

habitRouter.post("/add-habit",authorize , addHabit);

export { habitRouter };
