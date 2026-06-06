import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "@/src/components/common/AppScreen";
import { IconButton } from "@/src/components/common/IconButton";
import { LanguageSwitcher } from "@/src/components/common/LanguageSwitcher";
import { ThemeSwitcher } from "@/src/components/common/ThemeSwitcher";
import { SectionHeader } from "@/src/components/sections/SectionHeader";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { useAppContext } from "@/src/store/AppContext";
import { spacing, radius } from "@/src/theme";

const aboutValues: {
  icon: keyof typeof Ionicons.glyphMap;
  key: "aboutValueExplore" | "aboutValueSave" | "aboutValueAi";
}[] = [
  { icon: "earth-outline", key: "aboutValueExplore" },
  { icon: "heart-outline", key: "aboutValueSave" },
  { icon: "sparkles-outline", key: "aboutValueAi" },
];

export default function AboutScreen() {
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { avatarImages, places, user } = useAppContext();
  const { navigate } = useNavigation();
  const avatarUri = user?.avatar ?? avatarImages[0];
  const illustrationUri = places[0]?.image;

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.profileRow}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.colors.surfaceMuted },
              ]}
            />
          )}
          <View style={styles.greetingWrap}>
            <Text style={[styles.hello, { color: theme.colors.textMuted }]}>Hello,</Text>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {user?.name ?? ""}
            </Text>
          </View>
        </View>
        <IconButton
          name="notifications-outline"
          accessibilityLabel="Open notifications"
          onPress={() => navigate("Notification")}
        />
      </View>

      <View style={styles.heroTextWrap}>
        <Text style={[styles.heroText, { color: theme.colors.text }]}>
          {t("about")}
        </Text>
        <Ionicons name="compass" size={20} color={theme.colors.primary} />
      </View>

      <View style={styles.switchers}>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </View>

      <View style={styles.body}>
        {illustrationUri ? (
          <Image source={{ uri: illustrationUri }} style={styles.illustration} />
        ) : (
          <View
            style={[
              styles.illustration,
              styles.illustrationFallback,
              { backgroundColor: theme.colors.surfaceMuted },
            ]}
          >
            <Ionicons name="map-outline" size={44} color={theme.colors.primary} />
          </View>
        )}

        <SectionHeader title={t("aboutAppTitle")} />
        <Text style={[styles.paragraph, { color: theme.colors.textMuted }]}>
          {t("aboutAppDescription")}
        </Text>

        <View style={styles.values}>
          {aboutValues.map((item) => (
            <View
              key={item.key}
              style={[
                styles.valueItem,
                { backgroundColor: theme.colors.surfaceRaised },
              ]}
            >
              <Ionicons name={item.icon} size={19} color={theme.colors.primary} />
              <Text style={[styles.valueText, { color: theme.colors.text }]}>
                {t(item.key)}
              </Text>
            </View>
          ))}
        </View>

        <SectionHeader title={t("aboutTeamTitle")} />
        <Text style={[styles.paragraph, { color: theme.colors.textMuted }]}>
          {t("aboutTeamDescription")}
        </Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  body: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingBottom: 132,
    paddingTop: spacing.sm,
  },
  greetingWrap: {
    marginLeft: spacing.sm,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  hello: {
    fontSize: 12,
    fontWeight: "700",
  },
  heroText: {
    fontSize: 22,
    fontWeight: "800",
    marginRight: spacing.xs,
    textAlign: "center",
  },
  heroTextWrap: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  illustration: {
    borderRadius: radius.lg,
    height: 188,
    marginBottom: spacing.xl,
    width: "100%",
  },
  illustrationFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  profileRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  switchers: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  valueItem: {
    alignItems: "center",
    borderRadius: radius.md,
    flex: 1,
    minHeight: 86,
    justifyContent: "center",
    padding: spacing.sm,
  },
  valueText: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: spacing.xs,
    textAlign: "center",
  },
  values: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
});
