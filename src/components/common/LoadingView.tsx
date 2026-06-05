import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";

export function LoadingView() {
  const { theme } = useAppTheme();
  const { t } = useLocalization();

  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.colors.primary} />
      <Text style={[styles.text, { color: theme.colors.textMuted }]}>
        {t("loading")}...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },
  text: {
    fontSize: 14,
    marginTop: spacing.sm,
  },
});
