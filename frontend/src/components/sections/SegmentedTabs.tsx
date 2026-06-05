import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { radius, spacing } from "@/src/theme";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type SegmentedTabsProps<T extends string> = {
  tabs: { key: T; label: string }[];
  activeKey: T;
  onChange: (key: T) => void;
};

export function SegmentedTabs<T extends string>({
  activeKey,
  onChange,
  tabs,
}: SegmentedTabsProps<T>) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeKey === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            onPress={() => onChange(tab.key)}
            style={[
              styles.tab,
              isActive && { backgroundColor: theme.colors.primarySoft },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? theme.colors.primary : theme.colors.text },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
  },
  tab: {
    alignItems: "center",
    borderRadius: radius.pill,
    flex: 1,
    minHeight: 38,
    justifyContent: "center",
  },
});
