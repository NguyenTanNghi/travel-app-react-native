import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomButton } from "@/src/components/buttons/CustomButton";
import { AppScreen } from "@/src/components/common/AppScreen";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { navigateTo } from "@/src/utils/navigation";
import { radius, spacing } from "@/src/theme";

export default function EmailSentScreen() {
  const { theme } = useAppTheme();
  const { t } = useLocalization();

  return (
    <AppScreen contentContainerStyle={styles.content} scroll>
      <AppHeader title="" />
      <View style={[styles.card, { backgroundColor: theme.colors.surfaceRaised }]}>
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.primarySoft }]}>
          <Ionicons name="mail-open-outline" size={34} color={theme.colors.primary} />
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t("checkEmail")}</Text>
        <Text style={[styles.message, { color: theme.colors.textMuted }]}>
          {t("checkEmailMessage")}
        </Text>
        <CustomButton
          title={t("signIn")}
          onPress={() => navigateTo("/SignIn")}
          style={styles.button}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "stretch",
    marginTop: spacing.xl,
  },
  card: {
    alignItems: "center",
    borderRadius: radius.xl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xxxl,
    padding: spacing.xxl,
  },
  content: {
    paddingTop: spacing.sm,
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 74,
    justifyContent: "center",
    width: 74,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: spacing.lg,
  },
});
