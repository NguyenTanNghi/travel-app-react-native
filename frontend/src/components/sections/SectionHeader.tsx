import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  actionLabel,
  onActionPress,
  title,
}: SectionHeaderProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {actionLabel ? (
        <TouchableOpacity activeOpacity={0.75} onPress={onActionPress}>
          <Text style={[styles.action, { color: theme.colors.primary }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    fontSize: 14,
    fontWeight: "700",
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
  },
});
