import { api } from "@/src/lib/api/axios";
import { useAuth } from "@/src/lib/AuthContext";
import { GetHabitsResponse, Habit } from "@/src/types/habits";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>();

  const { refresh } = useLocalSearchParams();
  const { user } = useAuth();

  const fetchHabits = useCallback(async () => {
    try {
      const response = await api.get<GetHabitsResponse>("/habit/get-habits");
      const { success, data } = response.data;

      if (!success) {
        console.log("Failed to fetch habits");
        return;
      }

      setHabits(data);
    } catch (error) {
      console.log("Error fetching habits:", error);
    }
  }, []);

  useEffect(() => {
    if (user) fetchHabits();
  }, [user, refresh, fetchHabits]);

  return (
    <ScrollView style={{ flex: 1 }}>
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
            <Surface
              key={habit._id.toString()}
              style={styles.card}
              elevation={0}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{habit.title}</Text>
                <Text style={styles.cardDescription}>{habit.description}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.streakContainer}>
                    <MaterialCommunityIcons
                      name="fire"
                      size={18}
                      color="#ff9800"
                    />
                    <Text style={styles.streakText}>
                      {habit.streakCount} day
                      {habit.streakCount > 1 ? "s" : ""} streak
                    </Text>
                  </View>

                  <View style={styles.frequencyContainer}>
                    <Text style={styles.frequencyText}>
                      {habit.frequency.charAt(0).toUpperCase() +
                        habit.frequency.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </Surface>
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
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#e9ecf1ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    padding: 20,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#22223b",
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 20,
    color: "#6c6c80",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  streakText: {
    marginLeft: 6,
    color: "#e28a05ff",
    fontWeight: "bold",
    fontSize: 16,
  },
  frequencyContainer: {
    backgroundColor: "#e9e3e3ff",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  frequencyText: {
    color: "#7c48ff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#666",
  },
});
