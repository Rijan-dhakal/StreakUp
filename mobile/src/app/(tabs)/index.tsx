import { api } from "@/src/lib/api/axios";
import { GetHabitsResponse, Habit } from "@/src/types/habits";
import { useState } from "react";
import {  TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>()

  const fetchHabits = async () => {
    try {
      const response = await api.get<GetHabitsResponse>("/habit/get-habits");
      const { success, data} = response.data;
      
      if(!success){
        console.log("Failed to fetch habits");
        return;
      }

      setHabits(data);
      console.log("Habits fetched successfully:", data);

    } catch (error) {
      console.log("Error fetching habits:", error);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={fetchHabits}><Text>Fetch Habits</Text></TouchableOpacity>
    </View>
  );
}
