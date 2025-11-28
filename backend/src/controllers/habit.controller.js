import { Habit } from "../models/habit.model.js";
import { apiError } from "../utils/apiError.js";
import {
  startOfDay,
  differenceInCalendarDays,
  isSameMonth,
  differenceInCalendarWeeks,
  addMonths,
} from "date-fns";

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
      userId: req.user.id,
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
    if (!userId) {
      return apiError(res, "User not authenticated", false, 401);
    }

    let habits = await Habit.find({ userId });

    const today = startOfDay(new Date());
    const bulkUpdates = [];

    for (const habit of habits) {
      if (!habit.lastCompleted) continue;

      const last = startOfDay(new Date(habit.lastCompleted));
      const dayDiff = differenceInCalendarDays(today, last);

      let shouldReset = false;

      // DAILY HABITS
      if (habit.frequency === "daily") {
        if (dayDiff > 1) {
          shouldReset = true;
        }
      }

      // WEEKLY HABITS
      if (habit.frequency === "weekly") {
        const weekDiff = differenceInCalendarWeeks(today, last, {
          weekStartsOn: 0,
        });

        if (weekDiff > 1) {
          shouldReset = true;
        }
      }

      // MONTHLY HABITS
      if (habit.frequency === "monthly") {
        const missedMonth =
          !isSameMonth(today, last) && !isSameMonth(today, addMonths(last, 1));

        if (missedMonth) {
          shouldReset = true;
        }
      }

      if (shouldReset) {
        bulkUpdates.push({
          updateOne: {
            filter: { _id: habit._id },
            update: { $set: { streakCount: 0 } },
          },
        });
      }
    }

    if (bulkUpdates.length > 0) {
      await Habit.bulkWrite(bulkUpdates);
    }

    // fetch again after reset
    habits = await Habit.find({ userId }).select("-updatedAt");

    return res.status(200).json({
      success: true,
      data: habits,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHabit = async (req, res, next) => {
  const habitId = req.params?.id;
  if (!habitId) {
    return apiError(res, "Habit ID is required", false, 400);
  }

  try {
    const habit = await Habit.findOneAndDelete({
      _id: habitId,
      userId: req.user.id,
    });

    if (!habit) {
      return apiError(res, "Habit not found or unauthorized", false, 404);
    }

    return res.status(200).json({
      success: true,
      message: "Habit deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const completeHabit = async (req, res, next) => {
  const habitId = req.params?.id;
  if (!habitId) {
    return apiError(res, "Habit ID is required", false, 400);
  }

  try {
    const habit = await Habit.findOne({
      _id: habitId,
      userId: req.user.id,
    });

    if (!habit) {
      return apiError(res, "Habit not found or unauthorized", false, 404);
    }

    // get today's date at midnight
    const today = startOfDay(new Date());

    // get last completed date at midnight if it exists
    const lastCompleted = habit.lastCompleted
      ? startOfDay(new Date(habit.lastCompleted))
      : null;

    // difference in days between today and last completion
    const dayDiff = lastCompleted
      ? differenceInCalendarDays(today, lastCompleted)
      : 0;

    // handle daily habit streak
    if (habit.frequency === "daily") {
      if (!lastCompleted) {
        habit.streakCount = 1; // first time completing
      } else {
        if (dayDiff === 0) {
          return apiError(res, "Habit already completed today", false, 400);
        } else if (dayDiff === 1) {
          habit.streakCount += 1; // consecutive day
        } else {
          habit.streakCount = 1; // missed one or more days
        }
      }
    }

    // handle weekly habit streak
    else if (habit.frequency === "weekly") {
      if (!lastCompleted) {
        habit.streakCount = 1; // first completion
      } else {
        const weekDiff = lastCompleted
          ? differenceInCalendarWeeks(today, lastCompleted, { weekStartsOn: 0 })
          : 0;

        if (weekDiff === 0) {
          return apiError(res, "Habit already completed this week", false, 400);
        } else if (weekDiff === 1) {
          habit.streakCount += 1; // consecutive week
        } else {
          habit.streakCount = 1; // skipped weeks
        }
      }
    }

    // handle monthly habit streak
    else if (habit.frequency === "monthly") {
      if (!lastCompleted) {
        habit.streakCount = 1; // first completion
      } else {
        if (isSameMonth(today, lastCompleted)) {
          return apiError(
            res,
            "Habit already completed this month",
            false,
            400
          );
        } else if (isSameMonth(today, addMonths(lastCompleted, 1))) {
          habit.streakCount += 1; // consecutive month
        } else {
          habit.streakCount = 1; // skipped one or more months
        }
      }
    }

    // update lastCompleted to today and save
    habit.lastCompleted = new Date();
    await habit.save();

    return res.status(200).json({
      success: true,
      message: "Marked completed",
    });
  } catch (error) {
    next(error);
  }
};
