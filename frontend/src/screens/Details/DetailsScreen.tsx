import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "@/src/components/common/AppScreen";
import { AvatarStack } from "@/src/components/common/AvatarStack";
import { IconButton } from "@/src/components/common/IconButton";
import { LoadingView } from "@/src/components/common/LoadingView";
import { RatingStars } from "@/src/components/common/RatingStars";
import { CustomButton } from "@/src/components/buttons/CustomButton";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { AppInput } from "@/src/components/inputs/AppInput";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useFavorites } from "@/src/hooks/useFavorites";
import { useLocalization } from "@/src/hooks/useLocalization";
import { usePlaces } from "@/src/hooks/usePlaces";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { useAppContext } from "@/src/store/AppContext";
import { formatCurrency } from "@/src/utils/format";
import { radius, spacing } from "@/src/theme";

export default function DetailsScreen() {
  const [bookingError, setBookingError] = useState("");
  const [guests, setGuests] = useState(1);
  const [isBooking, setBooking] = useState(false);
  const [travelDate, setTravelDate] = useState("");
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { apiToken, avatarImages, bookPlace } = useAppContext();
  const { currentRoute, navigate } = useNavigation();
  const { getPlaceById } = usePlaces();
  const { isFavorite, toggleFavorite } = useFavorites();
  const place = getPlaceById(currentRoute.params?.placeId);

  if (!place) {
    return <LoadingView />;
  }

  const totalPrice = place.price * guests;

  const handleBookNow = () => {
    setBookingError("");

    if (!apiToken) {
      setBookingError(t("signInToBook"));
      navigate("SignIn");
      return;
    }

    setBooking(true);

    void bookPlace({
      guests,
      placeId: place.id,
      travelDate: travelDate.trim() || undefined,
    })
      .then(() => {
        navigate("Bookings");
      })
      .catch((error) => {
        setBookingError(
          error instanceof Error ? error.message : t("bookingFailed"),
        );
      })
      .finally(() => {
        setBooking(false);
      });
  };

  return (
    <AppScreen scroll edges={["top"]} contentContainerStyle={styles.content}>
      <ImageBackground source={{ uri: place.image }} style={styles.hero}>
        <View style={[styles.heroOverlay, { backgroundColor: theme.colors.overlay }]}>
          <AppHeader
            title="Details"
            transparent
            right={
              <IconButton
                name={isFavorite(place.id) ? "heart" : "heart-outline"}
                accessibilityLabel="Toggle favorite"
                variant="ghost"
                color={theme.colors.white}
                onPress={() => toggleFavorite(place.id)}
              />
            }
          />
        </View>
      </ImageBackground>

      <View style={[styles.panel, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.dragHandle, { backgroundColor: theme.colors.border }]} />
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{place.title}</Text>
            <Text style={[styles.location, { color: theme.colors.textMuted }]}>
              {place.location}
            </Text>
          </View>
          <AvatarStack avatars={avatarImages} extraCount={place.peopleJoined} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="location-outline" size={16} color={theme.colors.icon} />
            <Text style={[styles.statText, { color: theme.colors.textMuted }]}>
              {place.country}
            </Text>
          </View>
          <View style={styles.statItem}>
            <RatingStars rating={place.rating} size={13} />
            <Text style={[styles.reviewText, { color: theme.colors.textMuted }]}>
              ({place.reviews})
            </Text>
          </View>
          <Text style={[styles.price, { color: theme.colors.primary }]}>
            {formatCurrency(place.price)}/{t("perPerson")}
          </Text>
        </View>

        <View style={styles.gallery}>
          {place.gallery.map((image, index) => (
            <Image key={image} source={{ uri: image }} style={styles.galleryImage} />
          ))}
          <View style={[styles.galleryMore, { backgroundColor: theme.colors.overlay }]}>
            <Text style={[styles.galleryMoreText, { color: theme.colors.white }]}>+16</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t("aboutDestination")}
        </Text>
        <Text style={[styles.description, { color: theme.colors.textMuted }]}>
          {place.description}
        </Text>

        <View style={styles.bookingSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("bookingDetails")}
          </Text>
          <AppInput
            label={t("travelDate")}
            leftIcon="calendar-outline"
            placeholder="YYYY-MM-DD"
            value={travelDate}
            onChangeText={setTravelDate}
            containerStyle={styles.field}
          />
          <View style={styles.guestRow}>
            <View>
              <Text style={[styles.guestLabel, { color: theme.colors.text }]}>
                {t("guests")}
              </Text>
              <Text style={[styles.guestTotal, { color: theme.colors.textMuted }]}>
                {t("total")}: {formatCurrency(totalPrice)}
              </Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setGuests((current) => Math.max(1, current - 1))}
                style={[
                  styles.stepperButton,
                  { backgroundColor: theme.colors.surfaceMuted },
                ]}
              >
                <Ionicons name="remove" size={18} color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={[styles.guestCount, { color: theme.colors.text }]}>
                {guests}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setGuests((current) => current + 1)}
                style={[
                  styles.stepperButton,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Ionicons name="add" size={18} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          </View>
          {bookingError ? (
            <Text style={[styles.errorText, { color: theme.colors.danger }]}>
              {bookingError}
            </Text>
          ) : null}
        </View>

        <CustomButton
          disabled={isBooking}
          title={t("bookNow")}
          onPress={handleBookNow}
          style={styles.button}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.xl,
  },
  bookingSection: {
    marginTop: spacing.xl,
  },
  content: {
    paddingBottom: 0,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: spacing.sm,
  },
  field: {
    marginTop: spacing.sm,
  },
  dragHandle: {
    alignSelf: "center",
    borderRadius: radius.pill,
    height: 5,
    marginBottom: spacing.xl,
    width: 42,
  },
  gallery: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  galleryImage: {
    borderRadius: radius.md,
    height: 54,
    width: 54,
  },
  galleryMore: {
    alignItems: "center",
    borderRadius: radius.md,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  galleryMoreText: {
    fontSize: 14,
    fontWeight: "800",
  },
  guestCount: {
    fontSize: 16,
    fontWeight: "900",
    minWidth: 26,
    textAlign: "center",
  },
  guestLabel: {
    fontSize: 14,
    fontWeight: "800",
  },
  guestRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  guestTotal: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: spacing.xxs,
  },
  hero: {
    height: 430,
  },
  heroOverlay: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  location: {
    fontSize: 15,
    marginTop: spacing.xs,
  },
  panel: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -34,
    padding: spacing.lg,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
  },
  stepper: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  stepperButton: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  reviewText: {
    fontSize: 13,
    marginLeft: spacing.xxs,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: spacing.xs,
  },
  statItem: {
    alignItems: "center",
    flexDirection: "row",
  },
  statText: {
    fontSize: 14,
    marginLeft: spacing.xxs,
  },
  statsRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  titleBlock: {
    flex: 1,
    marginRight: spacing.md,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
});
