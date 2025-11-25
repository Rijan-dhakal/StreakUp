export type Habit = {
  _id: string;
  title: string;
  description?: string;
  streakCount: number;
  lastCompleted: string | null;
  userId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
}

export type GetHabitsResponse = {
  success: boolean;
  data: Habit[];
}
