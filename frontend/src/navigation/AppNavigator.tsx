import React from "react";
import ForgotPasswordScreen from "@/src/screens/Auth/ForgotPasswordScreen";
import EmailSentScreen from "@/src/screens/Auth/EmailSentScreen";
import SignInScreen from "@/src/screens/Auth/SignInScreen";
import SignUpScreen from "@/src/screens/Auth/SignUpScreen";
import AboutScreen from "@/src/screens/About/AboutScreen";
import BookingsScreen from "@/src/screens/Bookings/BookingsScreen";
import DetailsScreen from "@/src/screens/Details/DetailsScreen";
import FavoritePlacesScreen from "@/src/screens/FavoritePlaces/FavoritePlacesScreen";
import HomeScreen from "@/src/screens/Home/HomeScreen";
import AiChatScreen from "@/src/screens/AiChat/AiChatScreen";
import NotificationScreen from "@/src/screens/Notification/NotificationScreen";
import OnboardingScreen from "@/src/screens/Onboarding/OnboardingScreen";
import SplashScreen from "@/src/screens/Onboarding/SplashScreen";
import AllPopularTripPackageScreen from "@/src/screens/PopularPlaces/AllPopularTripPackageScreen";
import PopularPlacesScreen from "@/src/screens/PopularPlaces/PopularPlacesScreen";
import ContactPolicyScreen from "@/src/screens/Profile/ContactPolicyScreen";
import EditProfileScreen from "@/src/screens/Profile/EditProfileScreen";
import ProfileScreen from "@/src/screens/Profile/ProfileScreen";
import VerificationScreen from "@/src/screens/Profile/VerificationScreen";
import SearchScreen from "@/src/screens/Search/SearchScreen";
import { MainTabLayout } from "@/src/navigation/MainTabLayout";
import { useNavigation, type RouteName } from "@/src/navigation/NavigationContext";
import { useAppContext } from "@/src/store/AppContext";

const publicRoutes: RouteName[] = [
  "Splash",
  "Onboard1",
  "Onboard2",
  "Onboard3",
  "SignIn",
  "SignUp",
  "ForgotPassword",
  "ForgotPassword2",
  "Verification",
];

export default function AppNavigator() {
  const { currentRoute } = useNavigation();
  const { apiToken } = useAppContext();

  if (!apiToken && !publicRoutes.includes(currentRoute.name)) {
    return <SignInScreen />;
  }

  switch (currentRoute.name) {
    case "Splash":
      return <SplashScreen />;
    case "Onboard1":
      return <OnboardingScreen initialIndex={0} />;
    case "Onboard2":
      return <OnboardingScreen initialIndex={1} />;
    case "Onboard3":
      return <OnboardingScreen initialIndex={2} />;
    case "SignIn":
      return <SignInScreen />;
    case "SignUp":
      return <SignUpScreen />;
    case "ForgotPassword":
      return <ForgotPasswordScreen />;
    case "ForgotPassword2":
      return <EmailSentScreen />;
    case "Home":
      return (
        <MainTabLayout active="home">
          <HomeScreen />
        </MainTabLayout>
      );
    case "Details":
      return <DetailsScreen />;
    case "About":
      return (
        <MainTabLayout active="about">
          <AboutScreen />
        </MainTabLayout>
      );
    case "Bookings":
      return <BookingsScreen />;
    case "PopularPlaces":
      return <PopularPlacesScreen />;
    case "AllPopularTripPackage":
      return <AllPopularTripPackageScreen />;
    case "FavoritePlaces":
      return <FavoritePlacesScreen />;
    case "Search":
      return (
        <MainTabLayout active="search">
          <SearchScreen />
        </MainTabLayout>
      );
    case "Notification":
      return <NotificationScreen />;
    case "AiChat":
      return (
        <MainTabLayout active="aiChat">
          <AiChatScreen />
        </MainTabLayout>
      );
    case "Profile":
      return (
        <MainTabLayout active="profile">
          <ProfileScreen />
        </MainTabLayout>
      );
    case "EditProfile":
      return <EditProfileScreen />;
    case "ContactPolicy":
      return <ContactPolicyScreen />;
    case "Verification":
      return <VerificationScreen />;
    default:
      return (
        <MainTabLayout active="home">
          <HomeScreen />
        </MainTabLayout>
      );
  }
}
