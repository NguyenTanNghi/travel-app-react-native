import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { radius, spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import type { LanguageCode } from "@/src/types";

export function LanguageSwitcher() {
  const { theme } = useAppTheme();
  const { language, setLanguage, t } = useLocalization();
  const options: { code: LanguageCode; label: string }[] = [
    { code: "en", label: t("english") },
    { code: "vi", label: t("vietnamese") },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceMuted }]}>
      {options.map((option) => {
        const isActive = language === option.code;

        return (
          <TouchableOpacity
            key={option.code}
            activeOpacity={0.8}
            onPress={() => setLanguage(option.code)}
            style={[
              styles.option,
              isActive && { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? theme.colors.white : theme.colors.textMuted },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.pill,
    flexDirection: "row",
    padding: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
  },
  option: {
    alignItems: "center",
    borderRadius: radius.pill,
    justifyContent: "center",
    minHeight: 32,
    minWidth: 42,
    paddingHorizontal: spacing.sm,
  },
});
