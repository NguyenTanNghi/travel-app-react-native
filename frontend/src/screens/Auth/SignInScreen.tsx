import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomButton } from "@/src/components/buttons/CustomButton";
import { AppInput } from "@/src/components/inputs/AppInput";
import { PasswordInput } from "@/src/components/inputs/PasswordInput";
import { AuthScreenShell } from "@/src/screens/Auth/AuthScreenShell";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { radius, spacing } from "@/src/theme";

export default function SignInScreen() {
  const [email, setEmail] = useState("imanefh28@gmail.com");
  const [password, setPassword] = useState("travelapp");
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { navigate, replace } = useNavigation();

  return (
    <AuthScreenShell title={t("signInNow")} subtitle={t("pleaseSignIn")}>
      <AppInput
        containerStyle={styles.field}
        leftIcon="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
      />
      <PasswordInput
        containerStyle={styles.field}
        placeholder={t("password")}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => navigate("ForgotPassword")}
        style={styles.forgotWrap}
      >
        <Text style={[styles.link, { color: theme.colors.primary }]}>
          {t("forgotPassword")}
        </Text>
      </TouchableOpacity>
      <CustomButton
        title={t("signIn")}
        onPress={() => replace("Home")}
        style={styles.submit}
      />
      <View style={styles.switchRow}>
        <Text style={[styles.muted, { color: theme.colors.textMuted }]}>
          {t("noAccount")}
        </Text>
        <TouchableOpacity onPress={() => navigate("SignUp")}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>
            {t("signUp")}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.socialRow}>
        {(["logo-facebook", "logo-google", "logo-apple"] as const).map((icon) => (
          <TouchableOpacity
            key={icon}
            activeOpacity={0.8}
            style={[styles.socialButton, { backgroundColor: theme.colors.surfaceMuted }]}
          >
            <Ionicons name={icon} size={22} color={theme.colors.text} />
          </TouchableOpacity>
        ))}
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.md,
  },
  forgotWrap: {
    alignItems: "flex-end",
  },
  link: {
    fontSize: 14,
    fontWeight: "800",
    marginLeft: spacing.xs,
  },
  muted: {
    fontSize: 14,
    fontWeight: "600",
  },
  socialButton: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  socialRow: {
    flexDirection: "row",
    gap: spacing.lg,
    justifyContent: "center",
    marginTop: spacing.xxxl,
  },
  submit: {
    marginTop: spacing.xl,
  },
  switchRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
});
