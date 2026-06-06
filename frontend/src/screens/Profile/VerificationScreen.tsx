import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { CustomButton } from "@/src/components/buttons/CustomButton";
import { AppScreen } from "@/src/components/common/AppScreen";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { useAppContext } from "@/src/store/AppContext";
import { radius, spacing } from "@/src/theme";

export default function VerificationScreen() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { user, verifyOtp } = useAppContext();
  const { currentRoute, goBack, replace } = useNavigation();
  const verificationEmail = currentRoute.params?.email ?? user?.email ?? "";

  useEffect(() => {
    if (!currentRoute.params?.email) {
      replace("SignIn");
    }
  }, [currentRoute.params?.email, replace]);

  const updateDigit = (value: string, index: number) => {
    const nextValue = value.replace(/\D/g, "");

    if (nextValue.length > 1) {
      const nextCode = [...code];
      const pastedDigits = nextValue.slice(0, code.length - index).split("");

      pastedDigits.forEach((digit, offset) => {
        nextCode[index + offset] = digit;
      });

      setCode(nextCode);
      inputRefs.current[Math.min(index + pastedDigits.length, code.length - 1)]
        ?.focus();
      return;
    }

    const nextCode = [...code];
    nextCode[index] = nextValue;
    setCode(nextCode);

    if (nextValue && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setErrorMessage("");
    setSubmitting(true);

    void verifyOtp({
      code: code.join(""),
      email: verificationEmail,
    })
      .then(() => {
        if (currentRoute.params?.returnTo) {
          replace(currentRoute.params.returnTo);
          return;
        }

        goBack();
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to verify code",
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
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
              key={`otp-${index}`}
              ref={(input) => {
                inputRefs.current[index] = input;
              }}
              value={digit}
              onChangeText={(value) => updateDigit(value, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
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

        {errorMessage ? (
          <Text style={[styles.error, { color: theme.colors.danger }]}>
            {errorMessage}
          </Text>
        ) : null}
        <CustomButton
          disabled={isSubmitting}
          title={t("verify")}
          onPress={handleVerify}
          style={styles.button}
        />
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
    width: 44,
  },
  codeRow: {
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    marginTop: spacing.md,
  },
  error: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: spacing.md,
    textAlign: "center",
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
