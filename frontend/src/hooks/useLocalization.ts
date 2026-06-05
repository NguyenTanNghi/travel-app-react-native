import { useAppContext } from "@/src/store/AppContext";

export function useLocalization() {
  const { language, setLanguage, t } = useAppContext();

  return {
    language,
    setLanguage,
    t,
  };
}
