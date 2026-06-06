import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "@/src/components/common/AppScreen";
import { IconButton } from "@/src/components/common/IconButton";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { useAppContext } from "@/src/store/AppContext";
import { radius, spacing } from "@/src/theme";

type ProfileMenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
};

export default function ProfileScreen() {
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { avatarImages, signOut, user } = useAppContext();
  const { navigate, replace } = useNavigation();
  const avatarUri = user?.avatar ?? avatarImages[0];

  const menuItems: ProfileMenuItem[] = [
    { icon: "person-outline", label: t("profile"), onPress: () => navigate("EditProfile") },
    {
      icon: "bookmark-outline",
      label: t("bookmarked"),
      onPress: () => navigate("FavoritePlaces"),
    },
    {
      icon: "time-outline",
      label: t("previousTrips"),
      onPress: () => navigate("Bookings"),
    },
    {
      icon: "shield-checkmark-outline",
      label: t("contactAndPolicy"),
      onPress: () => navigate("ContactPolicy"),
    },
    {
      icon: "log-out-outline",
      label: t("logout"),
      onPress: () => {
        signOut();
        replace("SignIn");
      },
    },
  ];

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader
        title={t("profile")}
        right={
          <IconButton
            name="create-outline"
            accessibilityLabel="Edit profile"
            color={theme.colors.primary}
            onPress={() => navigate("EditProfile")}
          />
        }
      />
      <View style={styles.body}>
        <View style={styles.profileBlock}>
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
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {user?.name ?? ""}
          </Text>
          <Text style={[styles.email, { color: theme.colors.textMuted }]}>
            {user?.email ?? ""}
          </Text>
        </View>

        <View style={[styles.statsCard, { backgroundColor: theme.colors.surfaceRaised }]}>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: theme.colors.text }]}>
              {t("rewardPoints")}
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {user?.rewardPoints ?? 0}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: theme.colors.text }]}>
              {t("travelTrips")}
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {user?.travelTrips ?? 0}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: theme.colors.text }]}>
              {t("bucketList")}
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {user?.bucketList ?? 0}
            </Text>
          </View>
        </View>

        <View style={[styles.menuCard, { backgroundColor: theme.colors.surfaceRaised }]}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.8}
              onPress={item.onPress}
              style={styles.menuItem}
            >
              <Ionicons
                name={item.icon}
                size={18}
                color={
                  item.icon === "log-out-outline"
                    ? theme.colors.danger
                    : theme.colors.icon
                }
              />
              <Text
                style={[
                  styles.menuLabel,
                  {
                    color:
                      item.icon === "log-out-outline"
                        ? theme.colors.danger
                        : theme.colors.text,
                  },
                ]}
              >
                {item.label}
              </Text>
              {item.icon === "log-out-outline" ? null : (
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.colors.icon}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: radius.pill,
    height: 88,
    width: 88,
  },
  body: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingBottom: 132,
    paddingTop: spacing.sm,
  },
  email: {
    fontSize: 13,
    marginTop: 2,
  },
  menuCard: {
    borderRadius: radius.lg,
    paddingVertical: spacing.xs,
  },
  menuItem: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: spacing.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: spacing.sm,
  },
  profileBlock: {
    alignItems: "center",
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  statsCard: {
    borderRadius: radius.lg,
    flexDirection: "row",
    marginBottom: spacing.xl,
    padding: spacing.md,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: spacing.xs,
  },
});
