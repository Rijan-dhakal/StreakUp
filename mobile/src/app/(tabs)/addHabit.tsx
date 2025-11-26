import { api } from "@/src/lib/api/axios";
import { useAuth } from "@/src/lib/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const frequencies = ["daily", "weekly", "monthly"];

type Frequency = (typeof frequencies)[number];
type Habit = {
  success: boolean;
  message: string;
};

const addHabitScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();
  const theme = useTheme();

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in to add a habit");
      return;
    }

    try {
      const response = await api.post<Habit>("/habit/add-habit", {
        title,
        description,
        frequency,
      });

      console.log("Habit created successfully:", response.data);

      if (!response.data.success) {
        setError(response.data.message || "Failed to create habit");
        return;
      }

      setSuccess("Habit created successfully!");

      setError("");
      setTitle("");
      setDescription("");
      setFrequency("daily");

      setTimeout(() => {
        setSuccess("");
        router.push(`/?refresh=${Date.now()}`);
      }, 1000);

      // handle errors in catch block
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("An error occurred during creating the habit.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        mode="outlined"
        style={styles.input}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          setSuccess("");
          setError("");
        }}
      />
      <TextInput
        label="Description"
        mode="outlined"
        style={styles.input}
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          setSuccess("");
          setError("");
        }}
      />

      <View style={styles.frequencyContainer}>
        <SegmentedButtons
          value={frequency}
          onValueChange={(value) => setFrequency(value as Frequency)}
          buttons={frequencies.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
          }))}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!title || !description || !frequency}
      >
        Add Habit
      </Button>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        </View>
      )}

      {success && (
        <View style={styles.successContainer}>
          <Text style={[styles.successText, { color: theme.colors.primary }]}>
            {success}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },

  input: {
    marginBottom: 16,
  },

  frequencyContainer: {
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.2)",
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
  },
  successContainer: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 0, 0.2)",
  },
  successText: {
    textAlign: "center",
    fontSize: 16,
  },
});

export default addHabitScreen;
