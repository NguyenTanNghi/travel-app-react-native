import React from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "@/src/components/common/AppScreen";
import { AvatarStack } from "@/src/components/common/AvatarStack";
import { IconButton } from "@/src/components/common/IconButton";
import { RatingStars } from "@/src/components/common/RatingStars";
import { CustomButton } from "@/src/components/buttons/CustomButton";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { avatarImages } from "@/src/data/travelData";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useFavorites } from "@/src/hooks/useFavorites";
import { useLocalization } from "@/src/hooks/useLocalization";
import { usePlaces } from "@/src/hooks/usePlaces";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { formatCurrency } from "@/src/utils/format";
import { radius, spacing } from "@/src/theme";

export default function DetailsScreen() {
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { currentRoute } = useNavigation();
  const { getPlaceById } = usePlaces();
  const { isFavorite, toggleFavorite } = useFavorites();
  const place = getPlaceById(currentRoute.params?.placeId);

  return (
    <AppScreen scroll edges={["top"]} contentContainerStyle={styles.content}>
      <ImageBackground source={{ uri: place.image }} style={styles.hero}>
        <View style={[styles.heroOverlay, { backgroundColor: theme.colors.overlay }]}>
          <AppHeader
            title="Details"
            transparent
            right={
              <IconButton
                name={isFavorite(place.id) ? "heart" : "heart-outline"}
                accessibilityLabel="Toggle favorite"
                variant="ghost"
                color={theme.colors.white}
                onPress={() => toggleFavorite(place.id)}
              />
            }
          />
        </View>
      </ImageBackground>

      <View style={[styles.panel, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.dragHandle, { backgroundColor: theme.colors.border }]} />
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{place.title}</Text>
            <Text style={[styles.location, { color: theme.colors.textMuted }]}>
              {place.location}
            </Text>
          </View>
          <AvatarStack avatars={avatarImages} extraCount={place.peopleJoined} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="location-outline" size={16} color={theme.colors.icon} />
            <Text style={[styles.statText, { color: theme.colors.textMuted }]}>
              {place.country}
            </Text>
          </View>
          <View style={styles.statItem}>
            <RatingStars rating={place.rating} size={13} />
            <Text style={[styles.reviewText, { color: theme.colors.textMuted }]}>
              ({place.reviews})
            </Text>
          </View>
          <Text style={[styles.price, { color: theme.colors.primary }]}>
            {formatCurrency(place.price)}/{t("perPerson")}
          </Text>
        </View>

        <View style={styles.gallery}>
          {place.gallery.map((image, index) => (
            <Image key={image} source={{ uri: image }} style={styles.galleryImage} />
          ))}
          <View style={[styles.galleryMore, { backgroundColor: theme.colors.overlay }]}>
            <Text style={[styles.galleryMoreText, { color: theme.colors.white }]}>+16</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t("aboutDestination")}
        </Text>
        <Text style={[styles.description, { color: theme.colors.textMuted }]}>
          {place.description}
        </Text>

        <CustomButton title={t("bookNow")} onPress={() => {}} style={styles.button} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.xl,
  },
  content: {
    paddingBottom: 0,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  dragHandle: {
    alignSelf: "center",
    borderRadius: radius.pill,
    height: 5,
    marginBottom: spacing.xl,
    width: 42,
  },
  gallery: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  galleryImage: {
    borderRadius: radius.md,
    height: 54,
    width: 54,
  },
  galleryMore: {
    alignItems: "center",
    borderRadius: radius.md,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  galleryMoreText: {
    fontSize: 14,
    fontWeight: "800",
  },
  hero: {
    height: 430,
  },
  heroOverlay: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  location: {
    fontSize: 15,
    marginTop: spacing.xs,
  },
  panel: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -34,
    padding: spacing.lg,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
  },
  reviewText: {
    fontSize: 13,
    marginLeft: spacing.xxs,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: spacing.xs,
  },
  statItem: {
    alignItems: "center",
    flexDirection: "row",
  },
  statText: {
    fontSize: 14,
    marginLeft: spacing.xxs,
  },
  statsRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  titleBlock: {
    flex: 1,
    marginRight: spacing.md,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
});
