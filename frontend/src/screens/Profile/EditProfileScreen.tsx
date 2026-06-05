import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppScreen } from "@/src/components/common/AppScreen";
import { AppInput } from "@/src/components/inputs/AppInput";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { avatarImages } from "@/src/data/travelData";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { radius, spacing } from "@/src/theme";

export default function EditProfileScreen() {
  const [firstName, setFirstName] = useState("fh");
  const [lastName, setLastName] = useState("imane");
  const [location, setLocation] = useState("Algeria");
  const [mobileNumber, setMobileNumber] = useState("+213 7653247990");
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { goBack } = useNavigation();

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader
        title={t("editProfile")}
        right={
          <TouchableOpacity activeOpacity={0.75} onPress={goBack}>
            <Text style={[styles.done, { color: theme.colors.primary }]}>
              {t("done")}
            </Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.body}>
        <View style={styles.profileBlock}>
          <Image source={{ uri: avatarImages[0] }} style={styles.avatar} />
          <Text style={[styles.name, { color: theme.colors.text }]}>Imane fh</Text>
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
