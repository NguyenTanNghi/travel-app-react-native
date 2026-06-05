import { useAppContext } from "@/src/store/AppContext";

export function useAppTheme() {
  const { setThemeMode, theme, themeMode, toggleTheme } = useAppContext();

  return {
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
  };
}
