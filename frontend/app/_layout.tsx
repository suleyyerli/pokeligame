import { Stack } from "expo-router";
import { LogBox } from "react-native";
import { AuthProvider } from "./context/AuthContext";

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#FF0000",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="auth-modal"
          options={{
            presentation: "modal",
            title: "Authentification",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
