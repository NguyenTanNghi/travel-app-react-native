import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { CustomButton } from "@/src/components/buttons/CustomButton";
import { AppScreen } from "@/src/components/common/AppScreen";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { radius, spacing } from "@/src/theme";

export default function VerificationScreen() {
  const [code, setCode] = useState(["8", "6", "9", "5"]);
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { goBack } = useNavigation();

  const updateDigit = (value: string, index: number) => {
    const nextCode = [...code];
    nextCode[index] = value.slice(-1);
    setCode(nextCode);
  };

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader title="" />
      <View style={styles.body}>
        <View style={styles.headerBlock}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t("otpVerification")}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            {t("otpDescription")}
          </Text>
        </View>

        <Text style={[styles.label, { color: theme.colors.text }]}>{t("otpCode")}</Text>
        <View style={styles.codeRow}>
          {code.map((digit, index) => (
            <TextInput
              key={`${digit}-${index}`}
              value={digit}
              onChangeText={(value) => updateDigit(value, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              style={[
                styles.codeInput,
                {
                  backgroundColor: theme.colors.input,
                  color: theme.colors.text,
                },
              ]}
            />
          ))}
        </View>

        <CustomButton title={t("verify")} onPress={goBack} style={styles.button} />
        <View style={styles.resendRow}>
          <Text style={[styles.resend, { color: theme.colors.textMuted }]}>
            {t("resendCodeTo")}
          </Text>
          <Text style={[styles.timer, { color: theme.colors.textMuted }]}>01:26</Text>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.lg,
  },
  button: {
    marginTop: spacing.xl,
  },
  codeInput: {
    borderRadius: radius.sm,
    fontSize: 16,
    fontWeight: "800",
    height: 48,
    width: 54,
  },
  codeRow: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "center",
    marginTop: spacing.md,
  },
  content: {
    paddingTop: spacing.sm,
  },
  headerBlock: {
    alignItems: "center",
    marginBottom: spacing.xl,
    marginTop: spacing.xxxl,
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
  },
  resend: {
    fontSize: 12,
    fontWeight: "700",
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
    maxWidth: 250,
    textAlign: "center",
  },
  timer: {
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
  },
});
