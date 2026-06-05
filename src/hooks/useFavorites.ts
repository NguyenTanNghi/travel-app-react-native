import { places } from "@/src/data/travelData";
import { useAppContext } from "@/src/store/AppContext";

export function useFavorites() {
  const { favoritePlaceIds, isFavorite, toggleFavorite } = useAppContext();

  return {
    favoritePlaceIds,
    favoritePlaces: places.filter((place) => favoritePlaceIds.includes(place.id)),
    isFavorite,
    toggleFavorite,
  };
}
