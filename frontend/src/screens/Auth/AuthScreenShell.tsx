import React, { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppScreen } from "@/src/components/common/AppScreen";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type AuthScreenShellProps = PropsWithChildren<{
  title: string;
  subtitle: string;
}>;

export function AuthScreenShell({ children, subtitle, title }: AuthScreenShellProps) {
  const { theme } = useAppTheme();

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader title="" />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.body}>{children}</View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.sm,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
});
