import { api } from "@/src/lib/api/axios";
import { useAuth } from "@/src/lib/AuthContext";
import {
  HabitOperationResponse,
  GetHabitsResponse,
  Habit,
} from "@/src/types/habits";

import { useEffect, useState, useCallback } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import HabitCard from "@/src/components/HabitCard";


export default function Index() {
  const [habits, setHabits] = useState<Habit[]>();
  const { refresh } = useLocalSearchParams();
  const { user } = useAuth();

  const fetchHabits = useCallback(async () => {
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
    }
  }, []);

  useEffect(() => {
    if (user) fetchHabits();
  }, [user, refresh, fetchHabits]);

  const handleDeleteHabit = async (id: string) => {
    try {
      const response: HabitOperationResponse = await api.delete(
        `/habit/delete-habit/${id}`
      );

      if (response.data.success) fetchHabits();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || error.message);
    }
  };

  const handleCompletedHabit = async (id: string) => {
    try {
      const response: HabitOperationResponse = await api.patch(
        `/habit/complete-habit/${id}`
      );

      if (response.data.success) fetchHabits();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || error.message);
    }
  };

  // Action UI for swipe gestures
  const renderLeftActions = () => (
    <View style={styles.renderLeftActions}>
      <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff" />
    </View>
  );

  const renderRightActions = () => (
    <View style={styles.renderRightActions}>
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={32}
        color="#fff"
      />
    </View>
  );

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Today's Habits
          </Text>
        </View>

        {habits === undefined ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Loading...</Text>
          </View>
        ) : habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No habits found. Start by creating one!
            </Text>
          </View>
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onDelete={handleDeleteHabit}
              onComplete={handleCompletedHabit}
              renderLeftActions={renderLeftActions}
              renderRightActions={renderRightActions}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#666",
  },

  renderLeftActions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 18,
  },
  renderRightActions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 18,
  },
});
