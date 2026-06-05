import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { radius, spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import type { NotificationItem } from "@/src/types";

type NotificationCardProps = {
  item: NotificationItem;
};

export function NotificationCard({ item }: NotificationCardProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
        <Text
          numberOfLines={1}
          style={[styles.description, { color: theme.colors.textMuted }]}
        >
          {item.description}
        </Text>
      </View>
      <Text style={[styles.time, { color: theme.colors.textMuted }]}>{item.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: radius.pill,
    height: 40,
    marginRight: spacing.sm,
    width: 40,
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    marginLeft: spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
  },
});
