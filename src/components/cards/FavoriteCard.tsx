import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { PlaceCard } from "@/src/components/cards/PlaceCard";
import type { Place } from "@/src/types";

type FavoriteCardProps = {
  place: Place;
  onPress?: () => void;
  onRemove?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function FavoriteCard({ onPress, onRemove, place, style }: FavoriteCardProps) {
  return (
    <PlaceCard
      place={place}
      isFavorite
      onPress={onPress}
      onToggleFavorite={onRemove}
      style={style}
      variant="grid"
    />
  );
}
