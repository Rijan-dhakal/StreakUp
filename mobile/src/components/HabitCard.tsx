import { JSX, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { Text } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Habit } from "@/src/types/habits";

type Props = {
  habit: Habit;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  renderLeftActions: () => JSX.Element;
  renderRightActions: () => JSX.Element;
  completed?: boolean;
};

export default function HabitCard({
  habit,
  onDelete,
  onComplete,
  renderLeftActions,
  renderRightActions,
  completed,
}: Props) {
  const swipeRef = useRef<SwipeableMethods | null>(null);

  return (
    <Swipeable
      ref={swipeRef}
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        if (direction === "right") onDelete(habit._id);
        if (direction === "left") onComplete(habit._id);

        swipeRef.current?.close();
      }}
    >
      <View style={[styles.card, completed ? styles.cardCompleted : {}]}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{habit.title}</Text>
            {completed && (
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="#10b981"
              />
            )}
          </View>
          <Text style={styles.cardDescription}>{habit.description}</Text>

          <View style={styles.cardFooter}>
            <View style={styles.streakContainer}>
              <MaterialCommunityIcons name="fire" size={20} color="#f59e0b" />
              <Text style={styles.streakText}>
                {habit.streakCount} day{habit.streakCount !== 1 ? "s" : ""}
              </Text>
            </View>

            <View style={styles.frequencyContainer}>
              <MaterialCommunityIcons
                name={
                  habit.frequency === "daily"
                    ? "calendar-today"
                    : habit.frequency === "weekly"
                    ? "calendar-week"
                    : "calendar-month"
                }
                size={16}
                color="#7c3aed"
              />
              <Text style={styles.frequencyText}>
                {habit.frequency.charAt(0).toUpperCase() +
                  habit.frequency.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 16,
    color: "#64748b",
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  streakText: {
    color: "#92400e",
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd6fe",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  frequencyText: {
    color: "#5b21b6",
    fontWeight: "600",
    fontSize: 14,
  },
  cardCompleted: {
    opacity: 0.65,
  },
});
