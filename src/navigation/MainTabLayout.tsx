import React, { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBar, type TabKey } from "@/src/components/common/BottomTabBar";
import { spacing } from "@/src/theme";

type MainTabLayoutProps = PropsWithChildren<{
  active: TabKey;
}>;

export function MainTabLayout({ active, children }: MainTabLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <View
        pointerEvents="box-none"
        style={[
          styles.footer,
          {
            bottom: Math.max(insets.bottom, spacing.sm),
          },
        ]}
      >
        <BottomTabBar active={active} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    left: 0,
    position: "absolute",
    right: 0,
  },
});
