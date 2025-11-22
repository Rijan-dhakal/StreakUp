import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { z } from "zod";

const authSchema = z.object({
  email: z.email("Invalid Email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme()
  const router = useRouter();

  const { signUp, signIn } = useAuth();


  const handleAuth = async() => {
    const result = authSchema.safeParse({ email, password });

    if (!result.success) {
      const error = result.error.issues[0]?.message;
      setError(error);
      return;
    }

    setError(null);
    console.log("Validation passed:", result.data);

    if (isSignUp) {
     const error =  await signUp(email, password);
     if(error) setError(error);
    } else {
      const error = await signIn(email, password);
      if (error) setError(error);
    }
  
      router.replace("/(tabs)")

  };

  const handleAuthSwitchMode = () => {
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
          onChangeText={setEmail}
          label="Email"
          autoCapitalize="none"
          inputMode="email"
          placeholder="example@example.com"
          mode="outlined"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          inputMode="text"
          label="Password"
          autoCapitalize="none"
          secureTextEntry={true}
          placeholder="Enter password"
          mode="outlined"
        />

        {error ? (
          <Text style={{ color: theme.colors.error, marginTop: 6 }}>{error}</Text>
        ) : (
          <Text style={{ marginTop: 6 }}>{""}</Text>
        )}

        <Button style={styles.button} mode="contained" onPress={handleAuth}>
          {isSignUp ? "Sign Up" : "Sign In"}
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
