import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "@/src/components/common/AppScreen";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { SectionHeader } from "@/src/components/sections/SectionHeader";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { radius, spacing } from "@/src/theme";

const socialIcons: (keyof typeof Ionicons.glyphMap)[] = [
  "logo-facebook",
  "logo-instagram",
  "logo-twitter",
  "logo-linkedin",
];

export default function ContactPolicyScreen() {
  const { theme } = useAppTheme();
  const { t } = useLocalization();

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader title={t("contactAndPolicy")} />
      <View style={styles.body}>
        <SectionHeader title={t("contactInfo")} />
        <View style={[styles.panel, { backgroundColor: theme.colors.surfaceRaised }]}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              support@travelexplorer.app
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              +84 900 123 456
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              Ho Chi Minh City, Vietnam
            </Text>
          </View>
        </View>

        <SectionHeader title={t("socialNetworks")} />
        <View style={styles.socialRow}>
          {socialIcons.map((icon) => (
            <TouchableOpacity
              key={icon}
              activeOpacity={0.8}
              style={[
                styles.socialButton,
                { backgroundColor: theme.colors.primarySoft },
              ]}
            >
              <Ionicons name={icon} size={22} color={theme.colors.primary} />
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title={t("privacyPolicy")} />
        <Text style={[styles.paragraph, { color: theme.colors.textMuted }]}>
          {t("privacyPolicyText")}
        </Text>

        <SectionHeader title={t("termsOfUse")} />
        <Text style={[styles.paragraph, { color: theme.colors.textMuted }]}>
          {t("termsOfUseText")}
        </Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingBottom: 132,
    paddingTop: spacing.sm,
  },
  infoRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: spacing.sm,
  },
  panel: {
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
    padding: spacing.md,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  socialButton: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  socialRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
});
