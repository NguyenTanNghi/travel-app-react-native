import { useCallback } from "react";
import { places, tripPackages } from "@/src/data/travelData";

export function usePlaces() {
  const getPlaceById = useCallback(
    (id?: string) => places.find((place) => place.id === id) ?? places[0],
    [],
  );

  const searchPlaces = useCallback((query: string) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return places;
    }

    return places.filter((place) =>
      [place.title, place.location, place.country, place.category]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, []);

  return {
    places,
    popularPlaces: places.filter((place) => place.isPopular),
    tripPackages,
    getPlaceById,
    searchPlaces,
  };
}
