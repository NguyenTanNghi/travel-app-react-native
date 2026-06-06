import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { darkTheme, lightTheme, type AppTheme } from "@/src/theme";
import { translate, type TranslationKey } from "@/src/localization";
import { setApiAuthToken } from "@/src/services/apiClient";
import { travelApi } from "@/src/services/travelApi";
import type {
  Booking,
  AiChatMessage,
  LanguageCode,
  NotificationItem,
  OnboardingSlide,
  Place,
  ThemeMode,
  TripPackage,
  UserProfile,
} from "@/src/types";

type AuthCredentials = {
  email: string;
  password: string;
};

type SignUpPayload = AuthCredentials & {
  name: string;
};

type BookingPayload = {
  guests?: number;
  placeId: string;
  travelDate?: string;
};

type ProfileUpdate = Partial<
  Pick<
    UserProfile,
    | "avatar"
    | "email"
    | "firstName"
    | "lastName"
    | "location"
    | "mobileNumber"
    | "name"
  >
>;

type AppContextValue = {
  apiToken: string | null;
  dataError: string | null;
  theme: AppTheme;
  themeMode: ThemeMode;
  language: LanguageCode;
  isDataLoading: boolean;
  aiChatMessages: AiChatMessage[];
  aiChatStarterMessages: AiChatMessage[];
  avatarImages: string[];
  notifications: NotificationItem[];
  favoritePlaceIds: string[];
  bookings: Booking[];
  bookingError: string | null;
  isBookingLoading: boolean;
  onboardingSlides: OnboardingSlide[];
  places: Place[];
  tripPackages: TripPackage[];
  user: UserProfile | null;
  bookPlace: (payload: BookingPayload) => Promise<Booking>;
  clearNotifications: (status?: NotificationItem["status"]) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  refreshBookings: () => Promise<void>;
  refreshTravelData: () => Promise<void>;
  setAiChatMessages: React.Dispatch<React.SetStateAction<AiChatMessage[]>>;
  setThemeMode: (mode: ThemeMode) => void;
  signOut: () => void;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  toggleTheme: () => void;
  setLanguage: (language: LanguageCode) => void;
  toggleFavorite: (placeId: string) => void;
  isFavorite: (placeId: string) => boolean;
  updateProfile: (profile: ProfileUpdate) => Promise<UserProfile>;
  verifyOtp: (payload: { code: string; email: string }) => Promise<void>;
  t: (key: TranslationKey) => string;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [isDataLoading, setDataLoading] = useState(true);
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [aiChatMessages, setAiChatMessages] = useState<AiChatMessage[]>([]);
  const [aiChatStarterMessages, setAiChatStarterMessages] = useState<
    AiChatMessage[]
  >([]);
  const [avatarImages, setAvatarImages] = useState<string[]>([]);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favoritePlaceIds, setFavoritePlaceIds] = useState<string[]>([]);
  const [isBookingLoading, setBookingLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [onboardingSlides, setOnboardingSlides] = useState<OnboardingSlide[]>(
    [],
  );
  const [places, setPlaces] = useState<Place[]>([]);
  const [tripPackages, setTripPackages] = useState<TripPackage[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);

  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  const applyFavoritePlaceIds = useCallback((nextIds: string[]) => {
    setFavoritePlaceIds(nextIds);
    setUser((current) =>
      current ? { ...current, favoritePlaceIds: nextIds } : current,
    );
  }, []);

  const applyAuthenticatedUser = useCallback(
    (nextToken: string, nextUser: UserProfile) => {
      setApiToken(nextToken);
      setApiAuthToken(nextToken);
      setUser(nextUser);
      setFavoritePlaceIds(nextUser.favoritePlaceIds);
    },
    [],
  );

  const refreshTravelData = useCallback(async () => {
    setDataLoading(true);
    setDataError(null);

    try {
      const [
        appContent,
        nextNotifications,
        nextPlaces,
        nextTripPackages,
      ] = await Promise.all([
        travelApi.getAppContent(),
        travelApi.getNotifications(),
        travelApi.getPlaces(),
        travelApi.getTripPackages(),
      ]);

      setAiChatStarterMessages(appContent.aiChatStarterMessages);
      setAiChatMessages((current) =>
        current.length === 0 ? appContent.aiChatStarterMessages : current,
      );
      setAvatarImages(appContent.avatarImages);
      setNotifications(nextNotifications);
      setOnboardingSlides(appContent.onboardingSlides);
      setPlaces(nextPlaces);
      setTripPackages(nextTripPackages);
    } catch (error) {
      setDataError(
        error instanceof Error ? error.message : "Unable to load travel data",
      );
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshTravelData();
  }, [refreshTravelData]);

  const toggleTheme = useCallback(() => {
    setThemeMode((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const toggleFavorite = useCallback((placeId: string) => {
    const previousIds = favoritePlaceIds;
    const shouldAdd = !previousIds.includes(placeId);
    const nextIds = shouldAdd
      ? [...previousIds, placeId]
      : previousIds.filter((id) => id !== placeId);

    applyFavoritePlaceIds(nextIds);

    if (!apiToken) {
      return;
    }

    const request = shouldAdd
      ? travelApi.addFavorite(placeId)
      : travelApi.removeFavorite(placeId);

    void request
      .then((result) => {
        applyFavoritePlaceIds(result.favoritePlaceIds);
      })
      .catch(() => {
        applyFavoritePlaceIds(previousIds);
      });
  }, [apiToken, applyFavoritePlaceIds, favoritePlaceIds]);

  const isFavorite = useCallback(
    (placeId: string) => favoritePlaceIds.includes(placeId),
    [favoritePlaceIds],
  );

  const signIn = useCallback(
    async (credentials: AuthCredentials) => {
      const auth = await travelApi.signIn(credentials);
      applyAuthenticatedUser(auth.token, auth.user);
    },
    [applyAuthenticatedUser],
  );

  const signUp = useCallback(
    async (payload: SignUpPayload) => {
      const auth = await travelApi.signUp(payload);
      applyAuthenticatedUser(auth.token, auth.user);
    },
    [applyAuthenticatedUser],
  );

  const signOut = useCallback(() => {
    setApiToken(null);
    setApiAuthToken(null);
    setUser(null);
    setFavoritePlaceIds([]);
    setBookings([]);
    setAiChatMessages(aiChatStarterMessages);
  }, [aiChatStarterMessages]);

  const forgotPassword = useCallback(async (email: string) => {
    await travelApi.forgotPassword(email);
  }, []);

  const refreshBookings = useCallback(async () => {
    if (!apiToken) {
      setBookings([]);
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      setBookings(await travelApi.getBookings());
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : "Unable to load bookings",
      );
    } finally {
      setBookingLoading(false);
    }
  }, [apiToken]);

  const verifyOtp = useCallback(
    async (payload: { code: string; email: string }) => {
      const result = await travelApi.verifyOtp(payload);

      if (result.user) {
        setUser(result.user);
        setFavoritePlaceIds(result.user.favoritePlaceIds);
      }
    },
    [],
  );

  const updateProfile = useCallback(
    async (profile: ProfileUpdate) => {
      const nextUser = await travelApi.updateProfile(profile);
      setUser(nextUser);
      setFavoritePlaceIds(nextUser.favoritePlaceIds);
      return nextUser;
    },
    [],
  );

  const clearNotifications = useCallback(
    async (status?: NotificationItem["status"]) => {
      const nextNotifications = await travelApi.clearNotifications(status);
      setNotifications(nextNotifications);
    },
    [],
  );

  const bookPlace = useCallback(
    async (payload: BookingPayload) => {
      if (!apiToken) {
        throw new Error("Please sign in before booking.");
      }

      const booking = await travelApi.createBooking(payload);
      setBookings((current) => [booking, ...current]);

      return booking;
    },
    [apiToken],
  );

  const t = useCallback(
    (key: TranslationKey) => translate(language, key),
    [language],
  );

  const value = useMemo(
    () => ({
      aiChatMessages,
      aiChatStarterMessages,
      apiToken,
      bookingError,
      bookings,
      avatarImages,
      bookPlace,
      clearNotifications,
      dataError,
      theme,
      themeMode,
      language,
      isDataLoading,
      isBookingLoading,
      favoritePlaceIds,
      forgotPassword,
      notifications,
      onboardingSlides,
      places,
      refreshBookings,
      refreshTravelData,
      setAiChatMessages,
      setThemeMode,
      signIn,
      signOut,
      signUp,
      toggleTheme,
      setLanguage,
      tripPackages,
      toggleFavorite,
      isFavorite,
      updateProfile,
      user,
      verifyOtp,
      t,
    }),
    [
      aiChatMessages,
      aiChatStarterMessages,
      apiToken,
      bookingError,
      bookings,
      avatarImages,
      bookPlace,
      clearNotifications,
      dataError,
      favoritePlaceIds,
      forgotPassword,
      isFavorite,
      isDataLoading,
      isBookingLoading,
      language,
      notifications,
      onboardingSlides,
      places,
      refreshBookings,
      refreshTravelData,
      signIn,
      signOut,
      signUp,
      t,
      theme,
      themeMode,
      toggleFavorite,
      toggleTheme,
      tripPackages,
      updateProfile,
      user,
      verifyOtp,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}
