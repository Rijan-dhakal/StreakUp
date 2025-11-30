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
      }, 500);

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New Habit</Text>
        <Text style={styles.headerSubtitle}>
          Build consistency one step at a time
        </Text>
      </View>

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
        style={styles.button}
        buttonColor="#7c3aed"
      >
        Create Habit
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
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  frequencyContainer: {
    marginBottom: 24,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 4,
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  errorText: {
    textAlign: "center",
    fontSize: 14,
    color: "#dc2626",
  },
  successContainer: {
    backgroundColor: "#d1fae5",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  successText: {
    textAlign: "center",
    fontSize: 14,
    color: "#059669",
  },
});

export default addHabitScreen;
