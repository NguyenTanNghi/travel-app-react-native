import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  autoFocus?: boolean;
};

export function SearchBar({
  autoFocus = false,
  onChangeText,
  placeholder,
  value,
}: SearchBarProps) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.input }]}>
      <Ionicons name="search" size={18} color={theme.colors.icon} />
      <TextInput
        autoFocus={autoFocus}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, { color: theme.colors.text }]}
      />
      <Ionicons name="options-outline" size={18} color={theme.colors.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: radius.md,
    flexDirection: "row",
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: spacing.sm,
  },
});
