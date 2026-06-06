import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppScreen } from "@/src/components/common/AppScreen";
import { AppInput } from "@/src/components/inputs/AppInput";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { useAppContext } from "@/src/store/AppContext";
import { radius, spacing } from "@/src/theme";

export default function EditProfileScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setSaving] = useState(false);
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { avatarImages, updateProfile, user } = useAppContext();
  const { goBack, replace } = useNavigation();
  const profileAvatar = user?.avatar ?? avatarImages[0];
  const profileName = user?.name ?? "";

  useEffect(() => {
    if (!user) {
      return;
    }

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setLocation(user.location);
    setMobileNumber(user.mobileNumber);
  }, [user]);

  const handleDone = () => {
    setErrorMessage("");
    setSaving(true);

    const emailChanged = Boolean(
      user?.email && email.trim() && email.trim() !== user.email,
    );

    void updateProfile({
      email,
      firstName,
      lastName,
      location,
      mobileNumber,
    })
      .then((nextUser) => {
        if (emailChanged) {
          replace("Verification", {
            email: nextUser.email,
            returnTo: "Profile",
          });
          return;
        }

        goBack();
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to update profile",
        );
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader
        title={t("editProfile")}
        right={
          <TouchableOpacity
            activeOpacity={0.75}
            disabled={isSaving}
            onPress={handleDone}
          >
            <Text style={[styles.done, { color: theme.colors.primary }]}>
              {t("done")}
            </Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.body}>
        <View style={styles.profileBlock}>
          {profileAvatar ? (
            <Image source={{ uri: profileAvatar }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.colors.surfaceMuted },
              ]}
            />
          )}
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {profileName}
          </Text>
          <TouchableOpacity activeOpacity={0.75}>
            <Text style={[styles.changePhoto, { color: theme.colors.primary }]}>
              {t("changeProfilePicture")}
            </Text>
          </TouchableOpacity>
        </View>

        <AppInput
          label={t("firstName")}
          value={firstName}
          onChangeText={setFirstName}
          containerStyle={styles.field}
          right={<Text style={[styles.check, { color: theme.colors.primary }]}>✓</Text>}
        />
        <AppInput
          label={t("lastName")}
          value={lastName}
          onChangeText={setLastName}
          containerStyle={styles.field}
          right={<Text style={[styles.check, { color: theme.colors.primary }]}>✓</Text>}
        />
        <AppInput
          label={t("email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.field}
          right={<Text style={[styles.check, { color: theme.colors.primary }]}>✓</Text>}
        />
        <AppInput
          label={t("location")}
          value={location}
          onChangeText={setLocation}
          containerStyle={styles.field}
          right={<Text style={[styles.check, { color: theme.colors.primary }]}>✓</Text>}
        />
        <AppInput
          label={t("mobileNumber")}
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
          containerStyle={styles.field}
          right={<Text style={[styles.check, { color: theme.colors.primary }]}>✓</Text>}
        />
        {errorMessage ? (
          <Text style={[styles.error, { color: theme.colors.danger }]}>
            {errorMessage}
          </Text>
        ) : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: radius.pill,
    height: 88,
    width: 88,
  },
  body: {
    paddingHorizontal: spacing.lg,
  },
  changePhoto: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: spacing.xs,
  },
  check: {
    fontSize: 13,
    fontWeight: "900",
  },
  content: {
    paddingTop: spacing.sm,
  },
  done: {
    fontSize: 13,
    fontWeight: "800",
  },
  error: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: spacing.sm,
  },
  field: {
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: spacing.sm,
  },
  profileBlock: {
    alignItems: "center",
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
});
