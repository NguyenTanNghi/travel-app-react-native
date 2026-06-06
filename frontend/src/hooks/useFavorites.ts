import { useMemo } from "react";
import { useAppContext } from "@/src/store/AppContext";

export function useFavorites() {
  const { favoritePlaceIds, isFavorite, places, toggleFavorite } = useAppContext();
  const favoritePlaces = useMemo(
    () => places.filter((place) => favoritePlaceIds.includes(place.id)),
    [favoritePlaceIds, places],
  );

  return {
    favoritePlaceIds,
    favoritePlaces,
    isFavorite,
    toggleFavorite,
  };
}
