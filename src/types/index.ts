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

export type ScheduleItem = {
  id: string;
  placeId: string;
  title: string;
  image: string;
  date: string;
  location: string;
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

export type ChatPreview = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  online?: boolean;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  text: string;
  time: string;
  fromMe: boolean;
};
