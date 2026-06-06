import React from "react";
import {
  ImageBackground,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AvatarStack } from "@/src/components/common/AvatarStack";
import { RatingStars } from "@/src/components/common/RatingStars";
import { formatCurrency } from "@/src/utils/format";
import { radius, spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useAppContext } from "@/src/store/AppContext";
import type { Place } from "@/src/types";

type PlaceCardProps = {
  place: Place;
  isFavorite?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
  variant?: "featured" | "grid" | "compact";
  style?: StyleProp<ViewStyle>;
};

export function PlaceCard({
  isFavorite = false,
  onPress,
  onToggleFavorite,
  place,
  style,
  variant = "grid",
}: PlaceCardProps) {
  const { theme } = useAppTheme();
  const { avatarImages } = useAppContext();
  const isFeatured = variant === "featured";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        isFeatured ? styles.featuredCard : styles.gridCard,
        {
          backgroundColor: theme.colors.surfaceRaised,
          shadowColor: theme.colors.cardShadow,
        },
        style,
      ]}
    >
      <ImageBackground
        source={{ uri: place.image }}
        imageStyle={styles.image}
        style={[styles.imageWrap, isFeatured && styles.featuredImage]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onToggleFavorite}
          style={[
            styles.favoriteButton,
            {
              backgroundColor: isFavorite
                ? theme.colors.primary
                : "rgba(17, 19, 24, 0.58)",
            },
          ]}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={isFeatured ? 20 : 16}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            numberOfLines={1}
            style={[
              isFeatured ? styles.featuredTitle : styles.title,
              { color: theme.colors.text },
            ]}
          >
            {place.title}
          </Text>
          {isFeatured ? (
            <Text style={[styles.ratingValue, { color: theme.colors.text }]}>
              {place.rating.toFixed(1)}
            </Text>
          ) : null}
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={15} color={theme.colors.icon} />
          <Text
            numberOfLines={1}
            style={[styles.meta, { color: theme.colors.textMuted }]}
          >
            {place.country}
          </Text>
        </View>
        {isFeatured ? (
          <View style={styles.featuredFooter}>
            <AvatarStack avatars={avatarImages} extraCount={place.peopleJoined} />
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              {formatCurrency(place.price)}/Person
            </Text>
          </View>
        ) : (
          <View style={styles.gridFooter}>
            <RatingStars rating={place.rating} size={12} />
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              {formatCurrency(place.price)}/Person
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    elevation: 8,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  content: {
    padding: spacing.sm,
  },
  favoriteButton: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 34,
    justifyContent: "center",
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
    width: 34,
  },
  featuredCard: {
    marginRight: spacing.md,
    padding: spacing.xs,
    width: 282,
  },
  featuredFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  featuredImage: {
    height: 238,
  },
  featuredTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    marginRight: spacing.sm,
  },
  gridCard: {
    flex: 1,
    padding: spacing.xs,
  },
  gridFooter: {
    marginTop: spacing.xs,
  },
  image: {
    borderRadius: radius.md,
  },
  imageWrap: {
    height: 124,
    overflow: "hidden",
  },
  meta: {
    flex: 1,
    fontSize: 12,
    marginLeft: spacing.xxs,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: spacing.xs,
  },
  price: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: spacing.xs,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "800",
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
