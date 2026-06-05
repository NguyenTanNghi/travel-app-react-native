import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type AvatarStackProps = {
  avatars: string[];
  extraCount?: number;
  size?: number;
};

export function AvatarStack({ avatars, extraCount = 0, size = 28 }: AvatarStackProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.row}>
      {avatars.slice(0, 3).map((avatar, index) => (
        <Image
          key={avatar}
          source={{ uri: avatar }}
          style={[
            styles.avatar,
            {
              borderColor: theme.colors.surface,
              height: size,
              marginLeft: index === 0 ? 0 : -10,
              width: size,
            },
          ]}
        />
      ))}
      {extraCount > 0 ? (
        <View
          style={[
            styles.extra,
            {
              backgroundColor: theme.colors.primarySoft,
              borderColor: theme.colors.surface,
              height: size,
              marginLeft: -10,
              width: size,
            },
          ]}
        >
          <Text style={[styles.extraText, { color: theme.colors.primary }]}>
            +{extraCount}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 999,
    borderWidth: 2,
  },
  extra: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 2,
    justifyContent: "center",
  },
  extraText: {
    fontSize: 10,
    fontWeight: "700",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
});
