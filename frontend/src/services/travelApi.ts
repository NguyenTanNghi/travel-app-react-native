import { apiRequest } from "@/src/services/apiClient";
import type {
  Booking,
  AiChatMessage,
  LanguageCode,
  NotificationItem,
  OnboardingSlide,
  Place,
  TripPackage,
  UserProfile,
} from "@/src/types";

type ApiResponse<T> = {
  data: T;
  message?: string;
};

type AuthPayload = {
  token: string;
  user: UserProfile;
};

type FavoritePayload = {
  favoritePlaceIds: string[];
  isFavorite?: boolean;
  place?: Place;
  places?: Place[];
};

type AppContentPayload = {
  aiChatStarterMessages: AiChatMessage[];
  avatarImages: string[];
  onboardingSlides: OnboardingSlide[];
};

type AiTravelPayload = {
  places?: Place[];
  source: "provider" | "local";
  text: string;
};

function toQuery(params: Record<string, string | boolean | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export const travelApi = {
  async addFavorite(placeId: string) {
    const response = await apiRequest<ApiResponse<FavoritePayload>>(
      `/users/me/favorites/${placeId}`,
      {
        method: "POST",
      },
    );

    return response.data;
  },

  async clearNotifications(status?: NotificationItem["status"]) {
    const response = await apiRequest<ApiResponse<NotificationItem[]>>(
      `/notifications${toQuery({ status })}`,
      {
        method: "DELETE",
      },
    );

    return response.data;
  },

  async createBooking(payload: {
    guests?: number;
    placeId: string;
    travelDate?: string;
  }) {
    const response = await apiRequest<ApiResponse<Booking>>("/bookings", {
      body: JSON.stringify(payload),
      method: "POST",
    });

    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await apiRequest<
      ApiResponse<{ email: string; sent: boolean }>
    >("/auth/forgot-password", {
      body: JSON.stringify({ email }),
      method: "POST",
    });

    return response.data;
  },

  async getBookings() {
    const response = await apiRequest<ApiResponse<Booking[]>>("/bookings");
    return response.data;
  },

  async getAiTravelSuggestion(payload: {
    language: LanguageCode;
    prompt: string;
  }) {
    const response = await apiRequest<ApiResponse<AiTravelPayload>>("/ai/travel", {
      body: JSON.stringify(payload),
      method: "POST",
    });

    return response.data;
  },

  async getAppContent() {
    const response = await apiRequest<ApiResponse<AppContentPayload>>(
      "/app-content",
    );

    return response.data;
  },

  async getCurrentUser() {
    const response = await apiRequest<ApiResponse<UserProfile>>("/users/me");
    return response.data;
  },

  async getNotifications(status?: NotificationItem["status"]) {
    const response = await apiRequest<ApiResponse<NotificationItem[]>>(
      `/notifications${toQuery({ status })}`,
    );

    return response.data;
  },

  async getPlace(placeId: string) {
    const response = await apiRequest<ApiResponse<Place>>(`/places/${placeId}`);
    return response.data;
  },

  async getPlaces(params: {
    category?: string;
    country?: string;
    popular?: boolean;
    search?: string;
  } = {}) {
    const response = await apiRequest<ApiResponse<Place[]>>(
      `/places${toQuery(params)}`,
    );

    return response.data;
  },

  async getTripPackages(placeId?: string) {
    const response = await apiRequest<ApiResponse<TripPackage[]>>(
      `/trip-packages${toQuery({ placeId })}`,
    );

    return response.data;
  },

  async removeFavorite(placeId: string) {
    const response = await apiRequest<ApiResponse<FavoritePayload>>(
      `/users/me/favorites/${placeId}`,
      {
        method: "DELETE",
      },
    );

    return response.data;
  },

  async signIn(payload: { email: string; password: string }) {
    const response = await apiRequest<ApiResponse<AuthPayload>>("/auth/sign-in", {
      body: JSON.stringify(payload),
      method: "POST",
    });

    return response.data;
  },

  async signUp(payload: { email: string; name: string; password: string }) {
    const response = await apiRequest<ApiResponse<AuthPayload>>("/auth/sign-up", {
      body: JSON.stringify(payload),
      method: "POST",
    });

    return response.data;
  },

  async toggleFavorite(placeId: string) {
    const response = await apiRequest<ApiResponse<FavoritePayload>>(
      `/users/me/favorites/${placeId}/toggle`,
      {
        method: "PATCH",
      },
    );

    return response.data;
  },

  async updateProfile(payload: Partial<UserProfile>) {
    const response = await apiRequest<ApiResponse<UserProfile>>("/users/me", {
      body: JSON.stringify(payload),
      method: "PATCH",
    });

    return response.data;
  },

  async verifyOtp(payload: { code: string; email: string }) {
    const response = await apiRequest<
      ApiResponse<{
        purpose: "email_verification" | "password_reset";
        user: UserProfile;
        verified: boolean;
      }>
    >("/auth/verify-otp", {
      body: JSON.stringify(payload),
      method: "POST",
    });

    return response.data;
  },
};

export type { AiTravelPayload, AppContentPayload };
