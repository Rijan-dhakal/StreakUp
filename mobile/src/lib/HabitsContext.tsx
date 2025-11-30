import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Alert } from "react-native";
import { api } from "./api/axios";
import { useAuth } from "./AuthContext";
import { Habit, GetHabitsResponse } from "../types/habits";

type HabitsContextType = {
  habits: Habit[] | undefined;
  fetchHabits: () => Promise<void>;
  isLoading: boolean;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [habits, setHabits] = useState<Habit[]>();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchHabits = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await api.get<GetHabitsResponse>("/habit/get-habits");
      const { success, data } = response.data;

      if (!success) {
        Alert.alert("Error", "Failed to fetch habits.");
        return;
      }
      setHabits(data);
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchHabits();
  }, [user, fetchHabits]);

  return (
    <HabitsContext.Provider value={{ habits, fetchHabits, isLoading }}>
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitsProvider");
  }
  return context;
};
