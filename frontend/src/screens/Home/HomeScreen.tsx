import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "@/src/components/common/AppScreen";
import { IconButton } from "@/src/components/common/IconButton";
import { LanguageSwitcher } from "@/src/components/common/LanguageSwitcher";
import { LoadingView } from "@/src/components/common/LoadingView";
import { SearchBar } from "@/src/components/common/SearchBar";
import { ThemeSwitcher } from "@/src/components/common/ThemeSwitcher";
import { PlaceCard } from "@/src/components/cards/PlaceCard";
import { TripPackageCard } from "@/src/components/cards/TripPackageCard";
import { SectionHeader } from "@/src/components/sections/SectionHeader";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useFavorites } from "@/src/hooks/useFavorites";
import { useLocalization } from "@/src/hooks/useLocalization";
import { usePlaces } from "@/src/hooks/usePlaces";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { useAppContext } from "@/src/store/AppContext";
import { spacing } from "@/src/theme";

const SCREEN_SIDE_GUTTER = spacing.xl;

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { avatarImages, user } = useAppContext();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isDataLoading, popularPlaces, tripPackages } = usePlaces();
  const { navigate } = useNavigation();

  if (isDataLoading && popularPlaces.length === 0) {
    return <LoadingView />;
  }

  const avatarUri = user?.avatar ?? avatarImages[0];

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.profileRow}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.colors.surfaceMuted },
              ]}
            />
          )}
          <View style={styles.greetingWrap}>
            <Text style={[styles.hello, { color: theme.colors.textMuted }]}>Hello,</Text>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {user?.name ?? ""}
            </Text>
          </View>
        </View>
        <IconButton
          name="notifications-outline"
          accessibilityLabel="Open notifications"
          onPress={() => navigate("Notification")}
        />
      </View>

      <View style={styles.heroTextWrap}>
        <Text style={[styles.heroText, { color: theme.colors.text }]}>
          {t("discoverTitle")}
        </Text>
        <Ionicons name="airplane" size={20} color={theme.colors.primary} />
      </View>

      <View style={styles.searchWrap}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder={t("searchPlaces")}
        />
      </View>

      <View style={styles.switchers}>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderWrap}>
          <SectionHeader
            title={t("bestDestination")}
            actionLabel={t("viewAll")}
            onActionPress={() => navigate("PopularPlaces")}
          />
        </View>
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
              onPress={() => navigate("Details", { placeId: place.id })}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderWrap}>
          <SectionHeader
            title={t("popularPackages")}
            actionLabel={t("viewAll")}
            onActionPress={() => navigate("AllPopularTripPackage")}
          />
        </View>
        <View style={styles.packageList}>
          {tripPackages.slice(0, 2).map((item) => (
            <TripPackageCard
              key={item.id}
              tripPackage={item}
              onPress={() => navigate("Details", { placeId: item.placeId })}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigate("Search")}
        style={[styles.searchShortcut, { backgroundColor: theme.colors.primarySoft }]}
      >
        <Ionicons name="search" size={20} color={theme.colors.primary} />
        <Text style={[styles.searchShortcutText, { color: theme.colors.primary }]}>
          {t("search")}
        </Text>
      </TouchableOpacity>
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
    paddingBottom: 132,
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
    paddingHorizontal: SCREEN_SIDE_GUTTER,
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
    paddingHorizontal: SCREEN_SIDE_GUTTER,
  },
  horizontalList: {
    paddingLeft: SCREEN_SIDE_GUTTER,
    paddingRight: spacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
  },
  profileRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  packageList: {
    paddingHorizontal: SCREEN_SIDE_GUTTER,
  },
  searchWrap: {
    paddingHorizontal: SCREEN_SIDE_GUTTER,
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
  sectionHeaderWrap: {
    paddingHorizontal: SCREEN_SIDE_GUTTER,
  },
  switchers: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingHorizontal: SCREEN_SIDE_GUTTER,
  },
});
