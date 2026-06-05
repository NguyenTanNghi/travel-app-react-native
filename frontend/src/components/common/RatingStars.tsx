import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type RatingStarsProps = {
  rating: number;
  showValue?: boolean;
  size?: number;
};

export function RatingStars({
  rating,
  showValue = true,
  size = 14,
}: RatingStarsProps) {
  const { theme } = useAppTheme();
  const filledStars = Math.round(rating);

  return (
    <View style={styles.row}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Ionicons
          key={index}
          name={index < filledStars ? "star" : "star-outline"}
          size={size}
          color={theme.colors.warning}
          style={styles.star}
        />
      ))}
      {showValue ? (
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {rating.toFixed(1)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
  star: {
    marginRight: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: spacing.xxs,
  },
});
