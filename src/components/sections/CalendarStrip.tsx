import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";

const days = [
  { day: "S", date: "18" },
  { day: "M", date: "19" },
  { day: "T", date: "20" },
  { day: "W", date: "21" },
  { day: "T", date: "22" },
  { day: "F", date: "23" },
  { day: "S", date: "24" },
];

export function CalendarStrip() {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceRaised,
          shadowColor: theme.colors.cardShadow,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.month, { color: theme.colors.text }]}>22 October</Text>
        <View style={styles.actions}>
          <Ionicons name="chevron-back" size={22} color={theme.colors.icon} />
          <Ionicons name="chevron-forward" size={22} color={theme.colors.icon} />
        </View>
      </View>
      <View style={styles.days}>
        {days.map((item) => {
          const isActive = item.date === "22";

          return (
            <TouchableOpacity
              key={`${item.day}-${item.date}`}
              activeOpacity={0.8}
              style={[
                styles.day,
                isActive && { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.dayLabel,
                  { color: isActive ? "#FFD9CB" : theme.colors.textMuted },
                ]}
              >
                {item.day}
              </Text>
              <Text
                style={[
                  styles.dateLabel,
                  { color: isActive ? theme.colors.white : theme.colors.text },
                ]}
              >
                {item.date}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  card: {
    borderRadius: radius.xl,
    elevation: 8,
    marginBottom: spacing.xl,
    padding: spacing.md,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: spacing.sm,
  },
  day: {
    alignItems: "center",
    borderRadius: radius.md,
    minHeight: 66,
    minWidth: 40,
    paddingVertical: spacing.sm,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  days: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  month: {
    fontSize: 20,
    fontWeight: "800",
  },
});
