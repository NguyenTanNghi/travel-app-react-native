import React from "react";
import { StyleSheet, View } from "react-native";
import { AppScreen } from "@/src/components/common/AppScreen";
import { IconButton } from "@/src/components/common/IconButton";
import { ScheduleCard } from "@/src/components/cards/ScheduleCard";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { CalendarStrip } from "@/src/components/sections/CalendarStrip";
import { SectionHeader } from "@/src/components/sections/SectionHeader";
import { scheduleItems } from "@/src/data/travelData";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { spacing } from "@/src/theme";

export default function ScheduleScreen() {
  const { t } = useLocalization();
  const { navigate } = useNavigation();

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
            onPress={() => navigate("Details", { placeId: item.placeId })}
          />
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingBottom: 132,
    paddingTop: spacing.sm,
  },
});
