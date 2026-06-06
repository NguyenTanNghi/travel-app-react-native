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
import { useAppContext } from "@/src/store/AppContext";
import { radius, spacing } from "@/src/theme";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { signUp } = useAppContext();
  const { navigate, replace } = useNavigation();

  const handleSignUp = () => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    setErrorMessage("");

    if (!normalizedName) {
      setErrorMessage(t("fullNameRequired"));
      return;
    }

    if (!normalizedEmail) {
      setErrorMessage(t("emailRequired"));
      return;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setErrorMessage(t("invalidEmail"));
      return;
    }

    if (!password) {
      setErrorMessage(t("passwordRequired"));
      return;
    }

    if (password.length < 8) {
      setErrorMessage(t("passwordTooShort"));
      return;
    }

    setSubmitting(true);

    void signUp({ email: normalizedEmail, name: normalizedName, password })
      .then(() => {
        replace("Verification", {
          email: normalizedEmail,
          returnTo: "Home",
        });
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to sign up",
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <AuthScreenShell title={t("signUpNow")} subtitle={t("pleaseSignUp")}>
      <AppInput
        containerStyle={styles.field}
        leftIcon="person-outline"
        placeholder={t("fullName")}
        value={name}
        onChangeText={setName}
      />
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
      <Text style={[styles.hint, { color: theme.colors.textMuted }]}>
        {t("passwordHint")}
      </Text>
      {errorMessage ? (
        <Text style={[styles.error, { color: theme.colors.danger }]}>
          {errorMessage}
        </Text>
      ) : null}
      <CustomButton
        disabled={isSubmitting}
        title={t("signUp")}
        onPress={handleSignUp}
        style={styles.submit}
      />
      <View style={styles.switchRow}>
        <Text style={[styles.muted, { color: theme.colors.textMuted }]}>
          {t("haveAccount")}
        </Text>
        <TouchableOpacity onPress={() => navigate("SignIn")}>
          <Text style={[styles.link, { color: theme.colors.primary }]}>
            {t("signIn")}
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
  error: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: spacing.sm,
  },
  hint: {
    fontSize: 14,
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
    marginTop: spacing.xxxl,
  },
  switchRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
});
