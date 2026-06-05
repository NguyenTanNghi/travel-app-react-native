import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type IconName = keyof typeof Ionicons.glyphMap;

type IconButtonProps = {
  name: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  size?: number;
  iconSize?: number;
  color?: string;
  variant?: "ghost" | "soft" | "solid";
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  accessibilityLabel,
  color,
  iconSize = 22,
  name,
  onPress,
  size = 44,
  style,
  variant = "soft",
}: IconButtonProps) {
  const { theme } = useAppTheme();
  const backgroundColor =
    variant === "solid"
      ? theme.colors.primary
      : variant === "soft"
        ? theme.colors.surfaceMuted
        : "transparent";
  const iconColor =
    color ?? (variant === "solid" ? theme.colors.white : theme.colors.text);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        style,
      ]}
    >
      <Ionicons name={name} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
});
