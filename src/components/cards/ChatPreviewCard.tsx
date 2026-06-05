import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import type { ChatPreview } from "@/src/types";

type ChatPreviewCardProps = {
  item: ChatPreview;
  onPress?: () => void;
};

export function ChatPreviewCard({ item, onPress }: ChatPreviewCardProps) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.row}>
      <View>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.online ? (
          <View style={[styles.onlineDot, { backgroundColor: theme.colors.success }]} />
        ) : null}
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
        <Text
          numberOfLines={1}
          style={[
            styles.message,
            {
              color: item.unreadCount ? theme.colors.primary : theme.colors.textMuted,
            },
          ]}
        >
          {item.lastMessage}
        </Text>
      </View>
      <View style={styles.trailing}>
        <Text style={[styles.time, { color: theme.colors.textMuted }]}>{item.time}</Text>
        {item.unreadCount ? (
          <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.badgeText, { color: theme.colors.white }]}>
              {item.unreadCount}
            </Text>
          </View>
        ) : (
          <Ionicons name="checkmark-done" size={16} color={theme.colors.success} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: radius.pill,
    height: 48,
    width: 48,
  },
  badge: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 20,
    justifyContent: "center",
    marginTop: spacing.xs,
    minWidth: 20,
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  content: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  message: {
    fontSize: 13,
    marginTop: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "800",
  },
  onlineDot: {
    borderColor: "#FFFFFF",
    borderRadius: radius.pill,
    borderWidth: 2,
    bottom: 2,
    height: 12,
    position: "absolute",
    right: 1,
    width: 12,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  time: {
    fontSize: 11,
  },
  trailing: {
    alignItems: "flex-end",
  },
});
