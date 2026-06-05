import React from "react";
import { StyleSheet, View } from "react-native";
import { AppScreen } from "@/src/components/common/AppScreen";
import { EmptyState } from "@/src/components/common/EmptyState";
import { FavoriteCard } from "@/src/components/cards/FavoriteCard";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { SectionHeader } from "@/src/components/sections/SectionHeader";
import { useFavorites } from "@/src/hooks/useFavorites";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { spacing } from "@/src/theme";

export default function FavoritePlacesScreen() {
  const { favoritePlaces, toggleFavorite } = useFavorites();
  const { t } = useLocalization();
  const { navigate } = useNavigation();

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader title={t("favoritePlaces")} />
      <View style={styles.body}>
        <SectionHeader title={t("favoritePlaces")} />
        {favoritePlaces.length === 0 ? (
          <EmptyState
            icon="heart-outline"
            title={t("noFavorites")}
            message={t("noFavoritesMessage")}
          />
        ) : (
          <View style={styles.grid}>
            {favoritePlaces.map((place) => (
              <View key={place.id} style={styles.gridItem}>
                <FavoriteCard
                  place={place}
                  onRemove={() => toggleFavorite(place.id)}
                  onPress={() => navigate("Details", { placeId: place.id })}
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
});
