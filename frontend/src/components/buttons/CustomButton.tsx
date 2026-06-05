import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type CustomButtonProps = {
  title: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function CustomButton({
  disabled = false,
  icon,
  onPress,
  style,
  title,
  variant = "primary",
}: CustomButtonProps) {
  const { theme } = useAppTheme();
  const isPrimary = variant === "primary";
  const backgroundColor = isPrimary
    ? theme.colors.primary
    : variant === "secondary"
      ? theme.colors.surfaceMuted
      : "transparent";
  const color = isPrimary ? theme.colors.white : theme.colors.text;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor, opacity: disabled ? 0.56 : 1 },
        style,
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={18} color={color} style={styles.icon} />
      ) : null}
      <Text style={[styles.title, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radius.md,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: spacing.lg,
  },
  icon: {
    marginRight: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
  },
});
