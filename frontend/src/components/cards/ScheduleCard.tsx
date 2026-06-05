import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import type { ScheduleItem } from "@/src/types";

type ScheduleCardProps = {
  item: ScheduleItem;
  onPress?: () => void;
};

export function ScheduleCard({ item, onPress }: ScheduleCardProps) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceRaised,
          shadowColor: theme.colors.cardShadow,
        },
      ]}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.icon} />
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
            {item.date}
          </Text>
        </View>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={16} color={theme.colors.icon} />
          <Text
            numberOfLines={1}
            style={[styles.meta, { color: theme.colors.textMuted }]}
          >
            {item.location}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color={theme.colors.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: radius.lg,
    elevation: 7,
    flexDirection: "row",
    marginBottom: spacing.md,
    padding: spacing.sm,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  image: {
    borderRadius: radius.md,
    height: 82,
    marginRight: spacing.md,
    width: 82,
  },
  meta: {
    flex: 1,
    fontSize: 13,
    marginLeft: spacing.xs,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    marginVertical: spacing.xs,
  },
});
