import { useState } from "react";
import { View, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");

  const handleAuthSwitchMode = function () {
    setIsSignUp((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            console.log(text);
          }}
          label="email"
          autoCapitalize="none"
          inputMode="email"
          placeholder="example@example.com"
          mode="outlined"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(password) => {
            setPassword(password);
            console.log(password);
          }}
          label="Password"
          autoCapitalize="none"
          inputMode="text"
          secureTextEntry={true}
          placeholder="Enter password"
          mode="outlined"
        />

        <Button style={styles.button} mode="contained">
          {isSignUp ? "Sign Up" : "Sign in"}
        </Button>
        <Button
          style={styles.switchButton}
          mode="text"
          onPress={handleAuthSwitchMode}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "New to the app? Sign up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBlock: 20,
  },
  input: {
    marginBlock: 5,
  },
  button: {
    marginTop: 23,
  },
  switchButton: {
    marginTop: 10,
  },
});

export default AuthScreen;
