import { Habit } from "../models/habit.model.js";
import { apiError } from "../utils/apiError.js";

export const addHabit = async (req, res, next) => {
  const { title, description, frequency } = req.body;

  if (!title || !description || !frequency) {
    return apiError(res, "All fields are required", false, 400);
  }

  console.log("User ID from auth middleware:", req.user._id);

  try {
    await Habit.create({
      title,
      description,
      frequency,
      userId: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Habit added successfully",
    });
  } catch (error) {
    next(error);
  }
};
