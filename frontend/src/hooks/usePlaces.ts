import { useCallback, useMemo } from "react";
import { useAppContext } from "@/src/store/AppContext";

export function usePlaces() {
  const { dataError, isDataLoading, places, tripPackages } = useAppContext();

  const getPlaceById = useCallback(
    (id?: string) => places.find((place) => place.id === id) ?? places[0],
    [places],
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
  }, [places]);

  const popularPlaces = useMemo(
    () => places.filter((place) => place.isPopular),
    [places],
  );

  return {
    dataError,
    isDataLoading,
    places,
    popularPlaces,
    tripPackages,
    getPlaceById,
    searchPlaces,
  };
}
