import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { darkTheme, lightTheme, type AppTheme } from "@/src/theme";
import { translate, type TranslationKey } from "@/src/localization";
import type { LanguageCode, ThemeMode } from "@/src/types";

type AppContextValue = {
  theme: AppTheme;
  themeMode: ThemeMode;
  language: LanguageCode;
  favoritePlaceIds: string[];
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setLanguage: (language: LanguageCode) => void;
  toggleFavorite: (placeId: string) => void;
  isFavorite: (placeId: string) => boolean;
  t: (key: TranslationKey) => string;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [favoritePlaceIds, setFavoritePlaceIds] = useState<string[]>([
    "niladri-reservoir",
    "casa-las-tortugas",
  ]);

  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  const toggleTheme = useCallback(() => {
    setThemeMode((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const toggleFavorite = useCallback((placeId: string) => {
    setFavoritePlaceIds((current) =>
      current.includes(placeId)
        ? current.filter((id) => id !== placeId)
        : [...current, placeId],
    );
  }, []);

  const isFavorite = useCallback(
    (placeId: string) => favoritePlaceIds.includes(placeId),
    [favoritePlaceIds],
  );

  const t = useCallback(
    (key: TranslationKey) => translate(language, key),
    [language],
  );

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      language,
      favoritePlaceIds,
      setThemeMode,
      toggleTheme,
      setLanguage,
      toggleFavorite,
      isFavorite,
      t,
    }),
    [
      favoritePlaceIds,
      isFavorite,
      language,
      t,
      theme,
      themeMode,
      toggleFavorite,
      toggleTheme,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}
