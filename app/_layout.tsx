import { Stack } from "expo-router";
import { NavigationProvider } from "@/src/navigation/NavigationContext";
import { AppProvider } from "@/src/store/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <NavigationProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </NavigationProvider>
    </AppProvider>
  );
}
