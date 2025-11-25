import { Router } from "express";
import { addHabit, getHabits } from "../controllers/habit.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const habitRouter = Router();

habitRouter.post("/add-habit",authorize , addHabit);
habitRouter.get("/get-habits",authorize , getHabits);

export { habitRouter };
