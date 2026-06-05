import React from "react";
import { StyleSheet, View } from "react-native";
import { AppScreen } from "@/src/components/common/AppScreen";
import { BottomTabBar } from "@/src/components/common/BottomTabBar";
import { IconButton } from "@/src/components/common/IconButton";
import { ScheduleCard } from "@/src/components/cards/ScheduleCard";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { CalendarStrip } from "@/src/components/sections/CalendarStrip";
import { SectionHeader } from "@/src/components/sections/SectionHeader";
import { scheduleItems } from "@/src/data/travelData";
import { useLocalization } from "@/src/hooks/useLocalization";
import { navigateToPlace } from "@/src/utils/navigation";
import { spacing } from "@/src/theme";

export default function ScheduleScreen() {
  const { t } = useLocalization();

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader
        title={t("schedule")}
        right={<IconButton name="calendar" accessibilityLabel="Open calendar" />}
      />
      <View style={styles.body}>
        <CalendarStrip />
        <SectionHeader title={t("mySchedule")} actionLabel={t("viewAll")} />
        {scheduleItems.map((item) => (
          <ScheduleCard
            key={item.id}
            item={item}
            onPress={() => navigateToPlace(item.placeId)}
          />
        ))}
      </View>
      <BottomTabBar active="calendar" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingTop: spacing.sm,
  },
});
