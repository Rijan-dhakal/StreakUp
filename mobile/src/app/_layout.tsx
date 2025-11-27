import { Stack } from "expo-router";
import { AuthProvider } from "../lib/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
   <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
     </GestureHandlerRootView>
  );
}
