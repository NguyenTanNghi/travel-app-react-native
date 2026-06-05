import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { IconButton } from "@/src/components/common/IconButton";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppHeader({
  right,
  showBack = true,
  style,
  subtitle,
  title,
  transparent = false,
}: AppHeaderProps) {
  const { theme } = useAppTheme();
  const { canGoBack, goBack, replace } = useNavigation();
  const textColor = transparent ? theme.colors.white : theme.colors.text;
  const mutedColor = transparent ? "rgba(255,255,255,0.82)" : theme.colors.textMuted;

  const handleBack = () => {
    if (canGoBack) {
      goBack();
      return;
    }

    replace("Home");
  };

  return (
    <View style={[styles.container, style]}>
      {showBack ? (
        <IconButton
          name="chevron-back"
          accessibilityLabel="Go back"
          onPress={handleBack}
          variant={transparent ? "ghost" : "soft"}
          color={textColor}
        />
      ) : (
        <View style={styles.side} />
      )}
      <View style={styles.titleWrap}>
        <Text numberOfLines={1} style={[styles.title, { color: textColor }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, { color: mutedColor }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  side: {
    alignItems: "flex-end",
    minWidth: 44,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  titleWrap: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
});
