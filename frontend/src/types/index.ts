export type ThemeMode = "light" | "dark";

export type LanguageCode = "en" | "vi";

export type PlaceCategory =
  | "Beach"
  | "City"
  | "Desert"
  | "Mountain"
  | "Resort"
  | "Waterfall";

export type Place = {
  id: string;
  title: string;
  location: string;
  country: string;
  category: PlaceCategory;
  description: string;
  image: string;
  gallery: string[];
  price: number;
  rating: number;
  reviews: number;
  peopleJoined: number;
  isPopular: boolean;
};

export type TripPackage = {
  id: string;
  placeId: string;
  title: string;
  image: string;
  startDate: string;
  endDate: string;
  price: number;
  rating: number;
  joined: number;
};

export type OnboardingSlide = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  avatar: string;
  status: "recent" | "earlier" | "archived";
};

export type AiChatMessage = {
  id: string;
  recommendedPlaces?: Place[];
  text: string;
  time: string;
  role: "assistant" | "user";
};

export type UserProfile = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  location: string;
  mobileNumber: string;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  rewardPoints: number;
  travelTrips: number;
  bucketList: number;
  favoritePlaceIds: string[];
};

export type Booking = {
  id: string;
  userId: string;
  placeId: string;
  placeSnapshot?: {
    country: string;
    image: string;
    location: string;
    price: number;
    title: string;
  };
  status: "confirmed" | "cancelled";
  guests: number;
  travelDate: string | null;
  totalPrice: number;
  createdAt: string;
};
