import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "@/src/components/common/AppScreen";
import { BottomTabBar } from "@/src/components/common/BottomTabBar";
import { IconButton } from "@/src/components/common/IconButton";
import { LanguageSwitcher } from "@/src/components/common/LanguageSwitcher";
import { SearchBar } from "@/src/components/common/SearchBar";
import { ThemeSwitcher } from "@/src/components/common/ThemeSwitcher";
import { PlaceCard } from "@/src/components/cards/PlaceCard";
import { TripPackageCard } from "@/src/components/cards/TripPackageCard";
import { SectionHeader } from "@/src/components/sections/SectionHeader";
import { avatarImages } from "@/src/data/travelData";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useFavorites } from "@/src/hooks/useFavorites";
import { useLocalization } from "@/src/hooks/useLocalization";
import { usePlaces } from "@/src/hooks/usePlaces";
import { navigateTo, navigateToPlace } from "@/src/utils/navigation";
import { spacing } from "@/src/theme";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { popularPlaces, tripPackages } = usePlaces();

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <Image source={{ uri: avatarImages[0] }} style={styles.avatar} />
          <View style={styles.greetingWrap}>
            <Text style={[styles.hello, { color: theme.colors.textMuted }]}>Hello,</Text>
            <Text style={[styles.name, { color: theme.colors.text }]}>Imane</Text>
          </View>
        </View>
        <IconButton
          name="notifications-outline"
          accessibilityLabel="Open notifications"
          onPress={() => navigateTo("/Notification")}
        />
      </View>

      <View style={styles.heroTextWrap}>
        <Text style={[styles.heroText, { color: theme.colors.text }]}>
          {t("discoverTitle")}
        </Text>
        <Ionicons name="airplane" size={20} color={theme.colors.primary} />
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder={t("searchPlaces")}
      />

      <View style={styles.switchers}>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </View>

      <View style={styles.section}>
        <SectionHeader
          title={t("bestDestination")}
          actionLabel={t("viewAll")}
          onActionPress={() => navigateTo("/PopularPlaces")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {popularPlaces.slice(0, 5).map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              variant="featured"
              isFavorite={isFavorite(place.id)}
              onToggleFavorite={() => toggleFavorite(place.id)}
              onPress={() => navigateToPlace(place.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title={t("popularPackages")}
          actionLabel={t("viewAll")}
          onActionPress={() => navigateTo("/AllPopularTripPackage")}
        />
        {tripPackages.slice(0, 2).map((item) => (
          <TripPackageCard
            key={item.id}
            tripPackage={item}
            onPress={() => navigateToPlace(item.placeId)}
          />
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigateTo("/Search")}
        style={[styles.searchShortcut, { backgroundColor: theme.colors.primarySoft }]}
      >
        <Ionicons name="search" size={20} color={theme.colors.primary} />
        <Text style={[styles.searchShortcutText, { color: theme.colors.primary }]}>
          {t("search")}
        </Text>
      </TouchableOpacity>

      <BottomTabBar active="home" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  content: {
    paddingBottom: 12,
    paddingTop: spacing.sm,
  },
  greetingWrap: {
    marginLeft: spacing.sm,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  hello: {
    fontSize: 12,
    fontWeight: "700",
  },
  heroText: {
    fontSize: 22,
    fontWeight: "800",
    marginRight: spacing.xs,
    textAlign: "center",
  },
  heroTextWrap: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  horizontalList: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
  },
  profileRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  searchShortcut: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 999,
    flexDirection: "row",
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  searchShortcutText: {
    fontSize: 14,
    fontWeight: "800",
    marginLeft: spacing.xs,
  },
  section: {
    marginTop: spacing.xl,
  },
  switchers: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});
