import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";

const frequencies = ["daily", "weekly", "monthly"];

type Frequency = (typeof frequencies)[number];

const addHabitScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");

  const handleSubmit = () => {};

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        mode="outlined"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        label="Description"
        mode="outlined"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
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
});

export default addHabitScreen;
