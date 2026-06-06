import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type RouteName =
  | "Splash"
  | "Onboard1"
  | "Onboard2"
  | "Onboard3"
  | "SignIn"
  | "SignUp"
  | "ForgotPassword"
  | "ForgotPassword2"
  | "Home"
  | "About"
  | "Details"
  | "Bookings"
  | "PopularPlaces"
  | "AllPopularTripPackage"
  | "FavoritePlaces"
  | "Search"
  | "Notification"
  | "AiChat"
  | "Profile"
  | "EditProfile"
  | "ContactPolicy"
  | "Verification";

export type RouteParams = {
  email?: string;
  placeId?: string;
  returnTo?: RouteName;
};

type RouteState = {
  name: RouteName;
  params?: RouteParams;
};

type NavigationContextValue = {
  currentRoute: RouteState;
  canGoBack: boolean;
  navigate: (name: RouteName, params?: RouteParams) => void;
  replace: (name: RouteName, params?: RouteParams) => void;
  goBack: () => void;
};

const NavigationContext = createContext<NavigationContextValue | undefined>(
  undefined,
);

export function NavigationProvider({ children }: PropsWithChildren) {
  const [stack, setStack] = useState<RouteState[]>([{ name: "Splash" }]);
  const currentRoute = useMemo<RouteState>(
    () => stack[stack.length - 1] ?? { name: "Splash" },
    [stack],
  );

  const navigate = useCallback((name: RouteName, params?: RouteParams) => {
    setStack((current) => [...current, { name, params }]);
  }, []);

  const replace = useCallback((name: RouteName, params?: RouteParams) => {
    setStack((current) => {
      if (current.length === 0) {
        return [{ name, params }];
      }

      return [...current.slice(0, -1), { name, params }];
    });
  }, []);

  const goBack = useCallback(() => {
    setStack((current) => {
      if (current.length <= 1) {
        return [{ name: "Home" }];
      }

      return current.slice(0, -1);
    });
  }, []);

  const value = useMemo(
    () => ({
      currentRoute,
      canGoBack: stack.length > 1,
      navigate,
      replace,
      goBack,
    }),
    [currentRoute, goBack, navigate, replace, stack.length],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error("useNavigation must be used inside NavigationProvider");
  }

  return context;
}
