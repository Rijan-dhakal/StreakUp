import { api } from "@/src/lib/api/axios";
import { useHabits } from "@/src/lib/HabitsContext";
import { HabitOperationResponse } from "@/src/types/habits";

import { useEffect } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import HabitCard from "@/src/components/HabitCard";

export default function Index() {
  const { habits, fetchHabits } = useHabits();
  const { refresh } = useLocalSearchParams();

  useEffect(() => {
    if (refresh) fetchHabits();
  }, [refresh]);

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

  const isHabitCompleted = (
    lastCompleted: string | null,
    frequency: "daily" | "weekly" | "monthly"
  ): boolean => {
    if (!lastCompleted) return false;

    const today = new Date();
    const lastCompletedDate = new Date(lastCompleted);

    if (frequency === "daily") {
      // Check if completed today
      today.setHours(0, 0, 0, 0);
      lastCompletedDate.setHours(0, 0, 0, 0);
      return today.getTime() === lastCompletedDate.getTime();
    }

    if (frequency === "weekly") {
      // Check if completed this week (week starts on Sunday/Monday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);
      return lastCompletedDate >= startOfWeek;
    }

    if (frequency === "monthly") {
      // Check if completed this month
      return (
        lastCompletedDate.getMonth() === today.getMonth() &&
        lastCompletedDate.getFullYear() === today.getFullYear()
      );
    }

    return false;
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
    <ScrollView style={{ flex: 1, backgroundColor: "#f8f9fa" }} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Today's Habits</Text>
          <Text style={styles.subtitle}>
            {new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              month: "long", 
              day: "numeric" 
            })}
          </Text>
        </View>

        {habits === undefined ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="loading" size={48} color="#7c3aed" />
            <Text style={styles.emptyStateText}>Loading...</Text>
          </View>
        ) : habits.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="calendar-check" size={64} color="#cbd5e1" />
            <Text style={styles.emptyStateText}>
              No habits found. Start by creating one!
            </Text>
          </View>
        ) : (
          habits.map((habit) => {
            const completed = isHabitCompleted(
              habit.lastCompleted,
              habit.frequency
            );

            return (
              <HabitCard
                key={habit._id}
                habit={habit}
                onDelete={handleDeleteHabit}
                onComplete={handleCompletedHabit}
                renderLeftActions={renderLeftActions}
                renderRightActions={renderRightActions}
                completed={completed}
              />
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    color: "#64748b",
    fontSize: 16,
    marginTop: 12,
  },
  renderLeftActions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#ef4444",
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 2,
    paddingLeft: 20,
  },
  renderRightActions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "#10b981",
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 2,
    paddingRight: 20,
  },
});
