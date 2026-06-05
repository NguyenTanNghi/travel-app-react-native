import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { AppScreen } from "@/src/components/common/AppScreen";
import { EmptyState } from "@/src/components/common/EmptyState";
import { SearchBar } from "@/src/components/common/SearchBar";
import { PlaceCard } from "@/src/components/cards/PlaceCard";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { SectionHeader } from "@/src/components/sections/SectionHeader";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useFavorites } from "@/src/hooks/useFavorites";
import { useLocalization } from "@/src/hooks/useLocalization";
import { usePlaces } from "@/src/hooks/usePlaces";
import { navigateToPlace } from "@/src/utils/navigation";
import { spacing } from "@/src/theme";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { searchPlaces } = usePlaces();
  const results = searchPlaces(query);

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader
        title={t("search")}
        right={
          <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : null)}>
            <Text style={[styles.cancel, { color: theme.colors.primary }]}>
              {t("cancel")}
            </Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.body}>
        <SearchBar
          autoFocus
          value={query}
          onChangeText={setQuery}
          placeholder={t("searchPlaces")}
        />
        <View style={styles.resultsHeader}>
          <SectionHeader title={t("searchPlaces")} />
        </View>
        {results.length === 0 ? (
          <EmptyState title={t("noResults")} message={t("noResultsMessage")} />
        ) : (
          <View style={styles.grid}>
            {results.map((place) => (
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
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.lg,
  },
  cancel: {
    fontSize: 13,
    fontWeight: "800",
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
  resultsHeader: {
    marginTop: spacing.xl,
  },
});
