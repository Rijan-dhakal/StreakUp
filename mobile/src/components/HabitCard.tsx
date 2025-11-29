import { JSX, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { Surface, Text } from "react-native-paper";
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
      <Surface

      // applying styles based on completed or not condition
        style={[styles.card, completed ? styles.cardCompleted : {}]}
        elevation={0}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{habit.title}</Text>
          <Text style={styles.cardDescription}>{habit.description}</Text>

          <View style={styles.cardFooter}>
            <View style={styles.streakContainer}>
              <MaterialCommunityIcons name="fire" size={18} color="#ff9800" />
              <Text style={styles.streakText}>
                {habit.streakCount} day{habit.streakCount > 1 ? "s" : ""} streak
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
    </Swipeable>
  );
}

const styles = StyleSheet.create({
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
  cardCompleted: {
    opacity: 0.6  
  },
});
