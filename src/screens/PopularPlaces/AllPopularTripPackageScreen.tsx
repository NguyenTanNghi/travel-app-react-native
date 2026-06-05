import React from "react";
import { StyleSheet, View } from "react-native";
import { AppScreen } from "@/src/components/common/AppScreen";
import { TripPackageCard } from "@/src/components/cards/TripPackageCard";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { SectionHeader } from "@/src/components/sections/SectionHeader";
import { useLocalization } from "@/src/hooks/useLocalization";
import { usePlaces } from "@/src/hooks/usePlaces";
import { navigateToPlace } from "@/src/utils/navigation";
import { spacing } from "@/src/theme";

export default function AllPopularTripPackageScreen() {
  const { t } = useLocalization();
  const { tripPackages } = usePlaces();

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader title={t("popularPackages")} />
      <View style={styles.body}>
        <SectionHeader title={t("allPopularTripPackage")} />
        {tripPackages.map((item) => (
          <TripPackageCard
            key={item.id}
            tripPackage={item}
            onPress={() => navigateToPlace(item.placeId)}
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
    paddingTop: spacing.sm,
  },
});
