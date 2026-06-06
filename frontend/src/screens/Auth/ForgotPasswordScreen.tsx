import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { CustomButton } from "@/src/components/buttons/CustomButton";
import { AppInput } from "@/src/components/inputs/AppInput";
import { AuthScreenShell } from "@/src/screens/Auth/AuthScreenShell";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { useAppContext } from "@/src/store/AppContext";
import { spacing } from "@/src/theme";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { forgotPassword } = useAppContext();
  const { navigate } = useNavigation();

  const handleResetPassword = () => {
    setErrorMessage("");
    setSubmitting(true);

    void forgotPassword(email)
      .then(() => {
        navigate("ForgotPassword2");
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to send reset email",
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <AuthScreenShell
      title={t("forgotPasswordTitle")}
      subtitle={t("forgotPasswordSubtitle")}
    >
      <AppInput
        containerStyle={styles.field}
        leftIcon="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
      />
      {errorMessage ? (
        <Text style={[styles.error, { color: theme.colors.danger }]}>
          {errorMessage}
        </Text>
      ) : null}
      <CustomButton
        disabled={isSubmitting}
        title={t("resetPassword")}
        onPress={handleResetPassword}
      />
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.xl,
  },
  error: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
});
