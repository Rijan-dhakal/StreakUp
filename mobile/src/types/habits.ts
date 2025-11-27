export type Habit = {
  _id: string
  title: string
  description?: string
  streakCount: number
  lastCompleted: string | null
  userId: string
  frequency: 'daily' | 'weekly' | 'monthly'
 }


export type GetHabitsResponse = {
  success: boolean;
  data: Habit[];
}

export type HabitOperationResponse = {
  data: {
    success: boolean;
    message?: string;
  }
}
