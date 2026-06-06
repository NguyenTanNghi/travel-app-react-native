import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "@/src/components/common/AppScreen";
import { EmptyState } from "@/src/components/common/EmptyState";
import { LoadingView } from "@/src/components/common/LoadingView";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { useAppContext } from "@/src/store/AppContext";
import { formatCurrency } from "@/src/utils/format";
import { radius, spacing } from "@/src/theme";
import type { Booking } from "@/src/types";

function formatBookingDate(date: string | null, flexibleLabel: string) {
  if (!date) {
    return flexibleLabel;
  }

  return date;
}

function BookingItem({
  booking,
  onPress,
}: {
  booking: Booking;
  onPress?: () => void;
}) {
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const place = booking.placeSnapshot;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceRaised,
          shadowColor: theme.colors.cardShadow,
        },
      ]}
    >
      {place?.image ? (
        <Image source={{ uri: place.image }} style={styles.image} />
      ) : (
        <View
          style={[styles.image, { backgroundColor: theme.colors.surfaceMuted }]}
        />
      )}
      <View style={styles.cardContent}>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.text }]}>
          {place?.title ?? booking.placeId}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={15} color={theme.colors.icon} />
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
            {formatBookingDate(booking.travelDate, t("flexible"))}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="people-outline" size={15} color={theme.colors.icon} />
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
            {booking.guests} {t("person")}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={[styles.status, { color: theme.colors.success }]}>
            {booking.status}
          </Text>
          <Text style={[styles.total, { color: theme.colors.primary }]}>
            {formatCurrency(booking.totalPrice)}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.icon} />
    </TouchableOpacity>
  );
}

export default function BookingsScreen() {
  const {
    apiToken,
    bookingError,
    bookings,
    isBookingLoading,
    refreshBookings,
  } = useAppContext();
  const { t } = useLocalization();
  const { navigate } = useNavigation();

  useEffect(() => {
    void refreshBookings();
  }, [refreshBookings]);

  if (isBookingLoading && bookings.length === 0) {
    return <LoadingView />;
  }

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader title={t("myBookings")} />
      <View style={styles.body}>
        {!apiToken ? (
          <EmptyState
            icon="log-in-outline"
            title={t("signIn")}
            message={t("signInToBook")}
          />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon="briefcase-outline"
            title={t("noBookings")}
            message={bookingError ?? t("noBookingsMessage")}
          />
        ) : (
          bookings.map((booking) => (
            <BookingItem
              key={booking.id}
              booking={booking}
              onPress={() => navigate("Details", { placeId: booking.placeId })}
            />
          ))
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    alignItems: "center",
    borderRadius: radius.lg,
    elevation: 7,
    flexDirection: "row",
    marginBottom: spacing.md,
    padding: spacing.sm,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  cardContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  content: {
    paddingBottom: 132,
    paddingTop: spacing.sm,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  image: {
    borderRadius: radius.md,
    height: 86,
    marginRight: spacing.md,
    width: 86,
  },
  meta: {
    flex: 1,
    fontSize: 13,
    marginLeft: spacing.xs,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: spacing.xs,
  },
  status: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
  },
  total: {
    fontSize: 14,
    fontWeight: "900",
  },
});
