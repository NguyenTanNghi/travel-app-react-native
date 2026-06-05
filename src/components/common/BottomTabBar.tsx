import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { radius, spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";

type TabKey = "home" | "calendar" | "search" | "messages" | "profile";

type BottomTabBarProps = {
  active: TabKey;
};

export function BottomTabBar({ active }: BottomTabBarProps) {
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const tabs: {
    key: TabKey;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    href: Href;
  }[] = [
    { key: "home", label: t("home"), icon: "home-outline", href: "/Home" as Href },
    {
      key: "calendar",
      label: t("calendar"),
      icon: "calendar-outline",
      href: "/Schedule" as Href,
    },
    { key: "search", label: t("search"), icon: "search", href: "/Search" as Href },
    {
      key: "messages",
      label: t("messages"),
      icon: "chatbubble-ellipses-outline",
      href: "/Messages" as Href,
    },
    { key: "profile", label: t("profile"), icon: "person-outline", href: "/SignIn" as Href },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.cardShadow,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        const isSearch = tab.key === "search";

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            onPress={() => router.push(tab.href)}
            style={styles.item}
          >
            <View
              style={[
                styles.iconWrap,
                isSearch && {
                  backgroundColor: theme.colors.primary,
                  height: 50,
                  width: 50,
                },
              ]}
            >
              <Ionicons
                name={tab.icon}
                size={isSearch ? 24 : 22}
                color={
                  isSearch
                    ? theme.colors.white
                    : isActive
                      ? theme.colors.primary
                      : theme.colors.icon
                }
              />
            </View>
            {!isSearch ? (
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  { color: isActive ? theme.colors.primary : theme.colors.textMuted },
                ]}
              >
                {tab.label}
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    elevation: 12,
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 30,
    justifyContent: "center",
    marginBottom: spacing.xxs,
    width: 30,
  },
  item: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 58,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
  },
});
