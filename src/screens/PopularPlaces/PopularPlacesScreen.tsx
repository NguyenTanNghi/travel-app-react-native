import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppScreen } from "@/src/components/common/AppScreen";
import { SearchBar } from "@/src/components/common/SearchBar";
import { PlaceCard } from "@/src/components/cards/PlaceCard";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { SectionHeader } from "@/src/components/sections/SectionHeader";
import { useFavorites } from "@/src/hooks/useFavorites";
import { useLocalization } from "@/src/hooks/useLocalization";
import { usePlaces } from "@/src/hooks/usePlaces";
import { navigateToPlace } from "@/src/utils/navigation";
import { spacing } from "@/src/theme";

export default function PopularPlacesScreen() {
  const [query, setQuery] = useState("");
  const { t } = useLocalization();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { searchPlaces } = usePlaces();
  const places = searchPlaces(query);

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader title={t("popularPlaces")} />
      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t("searchPlaces")}
        />
      </View>
      <View style={styles.body}>
        <SectionHeader title={t("allPopularPlaces")} />
        <View style={styles.grid}>
          {places.map((place) => (
            <View key={place.id} style={styles.gridItem}>
              <PlaceCard
                place={place}
                isFavorite={isFavorite(place.id)}
                onToggleFavorite={() => toggleFavorite(place.id)}
                onPress={() => navigateToPlace(place.id)}
              />
            </View>
          ))}
        </View>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    marginBottom: spacing.md,
    width: "48%",
  },
  searchWrap: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
});
