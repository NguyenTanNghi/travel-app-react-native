import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type AppInputProps = Omit<TextInputProps, "style"> & {
  label?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  right?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export function AppInput({
  containerStyle,
  inputStyle,
  label,
  leftIcon,
  right,
  ...props
}: AppInputProps) {
  const { theme } = useAppTheme();

  return (
    <View style={containerStyle}>
      {label ? (
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      ) : null}
      <View style={[styles.field, { backgroundColor: theme.colors.input }]}>
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={18}
            color={theme.colors.icon}
            style={styles.icon}
          />
        ) : null}
        <TextInput
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.input, { color: theme.colors.text }, inputStyle]}
          {...props}
        />
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    alignItems: "center",
    borderRadius: radius.md,
    flexDirection: "row",
    minHeight: 56,
    paddingHorizontal: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
});
