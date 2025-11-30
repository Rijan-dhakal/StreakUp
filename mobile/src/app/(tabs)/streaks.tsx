import { useHabits } from "@/src/lib/HabitsContext";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const StreakScreen = () => {
  const { habits } = useHabits();

  const sortedHabits = habits?.sort((a, b) => b.streakCount - a.streakCount);

  if (!sortedHabits) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Habits not found.</Text>
      </View>
    );
  }

  const slicedHabits = sortedHabits?.slice(0, 3);

  let top = slicedHabits[0]?.streakCount;
  let secondTop = -1;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {slicedHabits?.map((habit, index) => {
        let medal = "";
        let colors: [string, string, string] = [
          "#CD7F32",
          "#B87333",
          "#A65E2E",
        ];

        if (habit.streakCount === top) {
          medal = "Gold";
          colors = ["#FFD700", "#FFB800", "#F7A400"];
        } else if (secondTop === -1) {
          secondTop = habit.streakCount;
          medal = "Silver";
          colors = ["#E0E0E0", "#C0C0C0", "#A8A8A8"];
        } else if (habit.streakCount === secondTop) {
          medal = "Silver";
          colors = ["#E0E0E0", "#C0C0C0", "#A8A8A8"];
        } else {
          medal = "Bronze";
          colors = ["#CD7F32", "#B87333", "#A65E2E"];
        }

        return (
          <View key={habit._id} style={{ marginBottom: 16 }}>
            <LinearGradient
              colors={colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardContainer}
            >
              <View style={styles.innerCard}>
                <View style={styles.leftContent}>
                  <Text style={styles.medalEmoji}>
                    {medal === "Gold" ? "🥇" : medal === "Silver" ? "🥈" : "🥉"}
                  </Text>

                  <Text style={styles.habitName}>{habit.title}</Text>
                </View>

                <View style={styles.fireContainer}>
                  <MaterialCommunityIcons
                    name="fire"
                    size={40}
                    color="#f97316"
                  />
                  <Text style={styles.streakDay}>{habit.streakCount} Days</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 18,
    padding: 12,
    marginVertical: 8,
  },

  innerCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },

  leftContent: {
    flexDirection: "column",
  },

  medalEmoji: {
    fontSize: 45,
    marginBottom: 6,
  },

  habitName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    maxWidth: 150,
  },

  fireContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7e6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  streakDay: {
    fontSize: 20,
    fontWeight: "700",
    color: "#c2410c",
    marginLeft: 6,
  },
});

export default StreakScreen;
