import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import type { ThemeMode } from "@/src/types";

export function ThemeSwitcher() {
  const { setThemeMode, theme, themeMode } = useAppTheme();
  const { t } = useLocalization();
  const options: { mode: ThemeMode; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { mode: "light", icon: "sunny-outline", label: t("lightMode") },
    { mode: "dark", icon: "moon-outline", label: t("darkMode") },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceMuted }]}>
      {options.map((option) => {
        const isActive = themeMode === option.mode;

        return (
          <TouchableOpacity
            key={option.mode}
            activeOpacity={0.8}
            onPress={() => setThemeMode(option.mode)}
            style={[
              styles.option,
              isActive && { backgroundColor: theme.colors.primary },
            ]}
          >
            <Ionicons
              name={option.icon}
              size={16}
              color={isActive ? theme.colors.white : theme.colors.icon}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? theme.colors.white : theme.colors.textMuted },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.pill,
    flexDirection: "row",
    padding: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: spacing.xxs,
  },
  option: {
    alignItems: "center",
    borderRadius: radius.pill,
    flexDirection: "row",
    minHeight: 32,
    paddingHorizontal: spacing.sm,
  },
});
