import { router, Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { HabitsProvider } from "@/src/lib/HabitsContext";

const TabsLayout = () => {
  return (
    <HabitsProvider>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: "#f8f9fa" },
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            height: 85,
            borderTopWidth: 1,
            borderTopColor: "#e2e8f0",
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
          tabBarActiveTintColor: "#7c3aed",
          tabBarInactiveTintColor: "#94a3b8",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/settings")}>
              <View style={{ paddingRight: 18 }}>
                <MaterialIcons
                  name="account-circle"
                  size={40}
                  color="#7c3aed"
                />
              </View>
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Habits",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="calendar-today"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="streaks"
          options={{
            title: "Streaks",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="chart-line"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="addHabit"
          options={{
            title: "Add habit",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="plus-circle"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </HabitsProvider>
  );
};

export default TabsLayout;
