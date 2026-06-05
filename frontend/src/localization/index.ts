import en from "./en";
import vi from "./vi";
import type { LanguageCode } from "@/src/types";

export const translations = {
  en,
  vi,
};

export type TranslationKey = keyof typeof en;

export function translate(language: LanguageCode, key: TranslationKey): string {
  return translations[language][key] ?? translations.en[key] ?? key;
}
