import { useRouter } from "expo-router";
import { useState } from "react";
import { View, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { ActivityIndicator, Button, Text, TextInput, useTheme } from "react-native-paper";
import { z } from "zod";
import { useAuth } from "../lib/AuthContext";

const authSchema = z.object({
  email: z.email("Enter a valid email address"),  
  password: z.string().min(6, "Password must be at least 6 characters"),
});
 
const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const theme = useTheme();
  const router = useRouter();

  const { signUp, signIn } = useAuth();

  const handleAuth = async () => {
    
    setError(null);
    
    
    const result = authSchema.safeParse({ email, password });

    if (!result.success) {
      const error = result.error.issues[0]?.message;
      setError(error);
      return;
    }

    setProcessing(true);

    try {
      let authError = null;

      if (isSignUp) {
        authError = await signUp(email, password);
      } else {
        authError = await signIn(email, password);
      }

      if (authError) {
        setError(authError);
        return;
      }

      
      router.replace("/(tabs)");
    } catch (err: any) {
      
      setError("An unexpected error occurred. Please try again.");
      console.error("Auth error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleAuthSwitchMode = () => {
    setIsSignUp((prev) => !prev);
    setError(null); 
    setEmail(""); 
    setPassword(""); 
  };

  const isFormValid = email.trim() && password.trim() && !processing;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>

        <Text style={styles.subtitle} variant="bodyMedium">
          {isSignUp ? "Sign up to get started" : "Sign in to your account"}
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          label="Email"
          autoCapitalize="none"
          autoComplete="email"
          inputMode="email"
          placeholder="example@example.com"
          mode="outlined"
          disabled={processing}
          left={<TextInput.Icon icon="email" />}
        />
        
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          inputMode="text"
          label="Password"
          autoCapitalize="none"
          autoComplete={isSignUp ? "password-new" : "password"}
          secureTextEntry={true}
          placeholder="Enter password"
          mode="outlined"
          disabled={processing}
          left={<TextInput.Icon icon="lock" />}
        />

        {error && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          </View>
        )}

        <Button 
          style={styles.button} 
          mode="contained" 
          onPress={handleAuth}
          disabled={!isFormValid || processing}
          contentStyle={styles.buttonContent}
        >
          {processing ? (
            <ActivityIndicator color={theme.colors.onPrimary} size="small" /> 
          ) : (
            isSignUp ? "Create Account" : "Sign In"
          )}
        </Button>

        <Button
          style={styles.switchButton}
          mode="text"
          onPress={handleAuthSwitchMode}
          disabled={processing}
          compact
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  switchButton: {
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.2)',
  },
  errorText: {
    textAlign: "center",
    fontSize: 14,
  },
});

export default AuthScreen;