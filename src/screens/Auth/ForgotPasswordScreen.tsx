import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { CustomButton } from "@/src/components/buttons/CustomButton";
import { AppInput } from "@/src/components/inputs/AppInput";
import { AuthScreenShell } from "@/src/screens/Auth/AuthScreenShell";
import { useLocalization } from "@/src/hooks/useLocalization";
import { navigateTo } from "@/src/utils/navigation";
import { spacing } from "@/src/theme";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("imanefh28@gmail.com");
  const { t } = useLocalization();

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
      <CustomButton
        title={t("resetPassword")}
        onPress={() => navigateTo("/ForgotPassword2")}
      />
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.xl,
  },
});
