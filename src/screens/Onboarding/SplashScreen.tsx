import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "@/src/components/common/AppScreen";
import { useLocalization } from "@/src/hooks/useLocalization";
import { replaceWith } from "@/src/utils/navigation";
import { spacing } from "@/src/theme";

export default function SplashScreen() {
  const { t } = useLocalization();

  useEffect(() => {
    const timeout = setTimeout(() => {
      replaceWith("/Onboard1");
    }, 1200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AppScreen backgroundColor="#FF6320" style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.center}>
        <View style={styles.logoMark}>
          <Ionicons name="airplane" size={36} color="#FF6320" />
        </View>
        <Text style={styles.title}>{t("appName")}</Text>
        <Text style={styles.tagline}>{t("splashTagline")}</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
  },
  logoMark: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: 60,
  },
  screen: {
    alignItems: "center",
    backgroundColor: "#FF6320",
    justifyContent: "center",
  },
  tagline: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    fontWeight: "700",
    marginTop: spacing.xs,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
});
