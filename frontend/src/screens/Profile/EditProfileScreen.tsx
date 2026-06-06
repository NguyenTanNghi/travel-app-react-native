import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomButton } from "@/src/components/buttons/CustomButton";
import { AppScreen } from "@/src/components/common/AppScreen";
import { AppInput } from "@/src/components/inputs/AppInput";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { useAppContext } from "@/src/store/AppContext";
import { radius, spacing } from "@/src/theme";

const MAX_AVATAR_LENGTH = 4_500_000;

function isValidImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function EditProfileScreen() {
  const [avatar, setAvatar] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { avatarImages, updateProfile, user } = useAppContext();
  const { goBack, replace } = useNavigation();
  const profileAvatar = avatar || avatarImages[0];
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
    setAvatar(user.avatar ?? "");
    setAvatarUrlInput(
      user.avatar?.startsWith("http") ? user.avatar : "",
    );
  }, [user]);

  const handlePickAvatar = async () => {
    setAvatarError("");

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setAvatarError(t("photoPermissionDenied"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      mediaTypes: ["images"],
      quality: 0.35,
    });

    if (result.canceled) {
      return;
    }

    const selectedAsset = result.assets[0];

    if (!selectedAsset) {
      return;
    }

    const nextAvatar = selectedAsset.base64
      ? `data:${selectedAsset.mimeType ?? "image/jpeg"};base64,${selectedAsset.base64}`
      : selectedAsset.uri;

    if (nextAvatar.length > MAX_AVATAR_LENGTH) {
      setAvatarError(t("imageTooLarge"));
      return;
    }

    setAvatar(nextAvatar);
    setAvatarUrlInput("");
    setAvatarModalVisible(false);
  };

  const handleUseAvatarUrl = () => {
    const nextAvatar = avatarUrlInput.trim();

    setAvatarError("");

    if (!nextAvatar) {
      setAvatarError(t("imageUrlRequired"));
      return;
    }

    if (!isValidImageUrl(nextAvatar)) {
      setAvatarError(t("invalidImageUrl"));
      return;
    }

    setAvatar(nextAvatar);
    setAvatarModalVisible(false);
  };

  const handleRemoveAvatar = () => {
    setAvatar("");
    setAvatarUrlInput("");
    setAvatarError("");
    setAvatarModalVisible(false);
  };

  const handleDone = () => {
    setErrorMessage("");
    setSaving(true);

    const emailChanged = Boolean(
      user?.email && email.trim() && email.trim() !== user.email,
    );

    void updateProfile({
      avatar,
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
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              setAvatarError("");
              setAvatarUrlInput(avatar.startsWith("http") ? avatar : "");
              setAvatarModalVisible(true);
            }}
          >
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
      <Modal
        animationType="fade"
        transparent
        visible={isAvatarModalVisible}
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalPanel, { backgroundColor: theme.colors.surfaceRaised }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {t("profilePhoto")}
              </Text>
              <TouchableOpacity
                accessibilityLabel="Close"
                activeOpacity={0.75}
                onPress={() => setAvatarModalVisible(false)}
                style={[styles.closeButton, { backgroundColor: theme.colors.surfaceMuted }]}
              >
                <Ionicons name="close" size={18} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {profileAvatar ? (
              <Image source={{ uri: profileAvatar }} style={styles.avatarPreview} />
            ) : (
              <View
                style={[
                  styles.avatarPreview,
                  { backgroundColor: theme.colors.surfaceMuted },
                ]}
              />
            )}

            <View style={styles.photoActionRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePickAvatar}
                style={[styles.photoAction, { backgroundColor: theme.colors.surfaceMuted }]}
              >
                <Ionicons name="image-outline" size={18} color={theme.colors.primary} />
                <Text style={[styles.photoActionText, { color: theme.colors.text }]}>
                  {t("uploadPhoto")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleRemoveAvatar}
                style={[styles.photoAction, { backgroundColor: theme.colors.surfaceMuted }]}
              >
                <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
                <Text style={[styles.photoActionText, { color: theme.colors.text }]}>
                  {t("removePhoto")}
                </Text>
              </TouchableOpacity>
            </View>

            <AppInput
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.urlField}
              keyboardType="url"
              label={t("imageUrl")}
              leftIcon="link-outline"
              onChangeText={setAvatarUrlInput}
              placeholder={t("pasteImageUrl")}
              value={avatarUrlInput}
            />

            {avatarError ? (
              <Text style={[styles.error, { color: theme.colors.danger }]}>
                {avatarError}
              </Text>
            ) : null}

            <CustomButton
              icon="link-outline"
              onPress={handleUseAvatarUrl}
              title={t("useImageUrl")}
              style={styles.urlButton}
            />
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: radius.pill,
    height: 88,
    width: 88,
  },
  avatarPreview: {
    alignSelf: "center",
    borderRadius: radius.pill,
    height: 104,
    marginBottom: spacing.lg,
    width: 104,
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
  closeButton: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 34,
    justifyContent: "center",
    width: 34,
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
  modalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalPanel: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
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
  photoAction: {
    alignItems: "center",
    borderRadius: radius.md,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: spacing.sm,
  },
  photoActionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  photoActionText: {
    fontSize: 13,
    fontWeight: "800",
    marginLeft: spacing.xs,
  },
  urlButton: {
    marginTop: spacing.lg,
  },
  urlField: {
    marginTop: spacing.xs,
  },
});
