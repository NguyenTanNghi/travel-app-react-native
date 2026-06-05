import React, { PropsWithChildren } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type AppScreenProps = PropsWithChildren<{
  scroll?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  edges?: React.ComponentProps<typeof SafeAreaView>["edges"];
}>;

export function AppScreen({
  backgroundColor,
  children,
  contentContainerStyle,
  edges,
  scroll = false,
  style,
}: AppScreenProps) {
  const { theme, themeMode } = useAppTheme();
  const screenBackground = backgroundColor ?? theme.colors.background;

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.safeArea, { backgroundColor: screenBackground }]}
    >
      <StatusBar style={themeMode === "dark" ? "light" : "dark"} />
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={[styles.fill, style]}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
