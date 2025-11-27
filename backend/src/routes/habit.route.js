import { Router } from "express";
import {
  addHabit,
  completeHabit,
  deleteHabit,
  getHabits,
} from "../controllers/habit.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const habitRouter = Router();

habitRouter.post("/add-habit", authorize, addHabit);
habitRouter.get("/get-habits", authorize, getHabits);
habitRouter.delete("/delete-habit/:id", authorize, deleteHabit);
habitRouter.patch("/complete-habit/:id", authorize, completeHabit);

export { habitRouter };
