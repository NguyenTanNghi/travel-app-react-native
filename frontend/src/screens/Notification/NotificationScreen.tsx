import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppScreen } from "@/src/components/common/AppScreen";
import { EmptyState } from "@/src/components/common/EmptyState";
import { NotificationCard } from "@/src/components/cards/NotificationCard";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { SegmentedTabs } from "@/src/components/sections/SegmentedTabs";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useAppContext } from "@/src/store/AppContext";
import { spacing } from "@/src/theme";
import type { NotificationItem } from "@/src/types";

type NotificationStatus = NotificationItem["status"];

export default function NotificationScreen() {
  const [activeStatus, setActiveStatus] = useState<NotificationStatus>("recent");
  const { clearNotifications, notifications } = useAppContext();
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const filteredNotifications = notifications.filter(
    (item) => item.status === activeStatus,
  );

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader
        title={t("notification")}
        right={
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              void clearNotifications(activeStatus).catch(() => {});
            }}
          >
            <Text style={[styles.clearText, { color: theme.colors.primary }]}>
              {t("clearAll")}
            </Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.body}>
        <SegmentedTabs
          activeKey={activeStatus}
          onChange={setActiveStatus}
          tabs={[
            { key: "recent", label: t("recent") },
            { key: "earlier", label: t("earlier") },
            { key: "archived", label: t("archived") },
          ]}
        />
        {filteredNotifications.length === 0 ? (
          <EmptyState
            icon="notifications-outline"
            title={t("notification")}
            message={t("noResultsMessage")}
          />
        ) : (
          filteredNotifications.map((item) => (
            <NotificationCard key={item.id} item={item} />
          ))
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.lg,
  },
  clearText: {
    fontSize: 12,
    fontWeight: "800",
  },
  content: {
    paddingTop: spacing.sm,
  },
});
