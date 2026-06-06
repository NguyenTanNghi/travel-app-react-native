import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AvatarStack } from "@/src/components/common/AvatarStack";
import { RatingStars } from "@/src/components/common/RatingStars";
import { formatCurrency, formatPackageDate } from "@/src/utils/format";
import { radius, spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useAppContext } from "@/src/store/AppContext";
import type { TripPackage } from "@/src/types";

type TripPackageCardProps = {
  tripPackage: TripPackage;
  onPress?: () => void;
  onReadMore?: () => void;
  readMoreLabel?: string;
};

export function TripPackageCard({
  onPress,
  onReadMore,
  readMoreLabel,
  tripPackage,
}: TripPackageCardProps) {
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { avatarImages } = useAppContext();
  const handleReadMore = onReadMore ?? onPress;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceRaised,
          shadowColor: theme.colors.cardShadow,
        },
      ]}
    >
      <Image source={{ uri: tripPackage.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: theme.colors.text }]}
          >
            {tripPackage.title}
          </Text>
          <View style={[styles.pricePill, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.priceText, { color: theme.colors.white }]}>
              {formatCurrency(tripPackage.price)}
            </Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.icon} />
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
            {formatPackageDate(tripPackage.startDate, tripPackage.endDate)}
          </Text>
        </View>
        <RatingStars rating={tripPackage.rating} size={12} />
        <View style={styles.joinedRow}>
          <AvatarStack avatars={avatarImages} size={24} />
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
            {tripPackage.joined} {t("person")} {t("joined")}
          </Text>
          {readMoreLabel ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleReadMore}
              style={[styles.readMoreButton, { backgroundColor: theme.colors.primarySoft }]}
            >
              <Text style={[styles.readMoreText, { color: theme.colors.primary }]}>
                {readMoreLabel}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={11}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    elevation: 8,
    flexDirection: "row",
    marginBottom: spacing.md,
    padding: spacing.sm,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  image: {
    borderRadius: radius.md,
    height: 116,
    marginRight: spacing.md,
    width: 96,
  },
  joinedRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: spacing.xs,
  },
  meta: {
    flex: 1,
    fontSize: 13,
    marginLeft: spacing.xs,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: spacing.xs,
  },
  pricePill: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
  },
  priceText: {
    fontSize: 12,
    fontWeight: "800",
  },
  readMoreButton: {
    alignItems: "center",
    borderRadius: radius.pill,
    flexDirection: "row",
    minHeight: 24,
    paddingHorizontal: spacing.xs,
  },
  readMoreText: {
    fontSize: 11,
    fontWeight: "800",
    marginRight: spacing.xxs,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    marginRight: spacing.xs,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
