import { Habit } from "../models/habit.model.js";
import { apiError } from "../utils/apiError.js";

export const addHabit = async (req, res, next) => {
  const { title, description, frequency } = req.body;

  if (!title || !description || !frequency) {
    return apiError(res, "All fields are required", false, 400);
  }

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

export const getHabits = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    if(!userId){
      return apiError(res, "User not authenticated", false, 401);
    }

    const habits = await Habit.find({userId}).select("-updatedAt");

    return res.status(200).json({
      success: true,
      data: habits,
    });

  } catch (error) {
    next(error);
  }
}