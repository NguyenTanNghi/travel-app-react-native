import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomButton } from "@/src/components/buttons/CustomButton";
import { AppScreen } from "@/src/components/common/AppScreen";
import { LoadingView } from "@/src/components/common/LoadingView";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { useAppContext } from "@/src/store/AppContext";
import { radius, spacing } from "@/src/theme";
import type { TranslationKey } from "@/src/localization";

type OnboardingScreenProps = {
  initialIndex?: number;
};

export default function OnboardingScreen({ initialIndex = 0 }: OnboardingScreenProps) {
  const [index, setIndex] = useState(initialIndex);
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const { replace } = useNavigation();
  const { dataError, isDataLoading, onboardingSlides, refreshTravelData } =
    useAppContext();

  if (isDataLoading && onboardingSlides.length === 0) {
    return <LoadingView />;
  }

  if (onboardingSlides.length === 0) {
    return (
      <AppScreen contentContainerStyle={styles.errorContent} scroll>
        <View style={styles.errorBlock}>
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            {t("loadDataError")}
          </Text>
          <Text style={[styles.errorMessage, { color: theme.colors.textMuted }]}>
            {dataError ?? "Please check the backend API URL."}
          </Text>
          <CustomButton
            title={t("retry")}
            onPress={() => {
              void refreshTravelData();
            }}
            style={styles.retryButton}
          />
        </View>
      </AppScreen>
    );
  }

  const slide = onboardingSlides[index] ?? onboardingSlides[0];
  const isLast = index === onboardingSlides.length - 1;

  const completeOnboarding = () => {
    replace("SignIn");
  };

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
      return;
    }

    setIndex((current) => Math.min(current + 1, onboardingSlides.length - 1));
  };

  return (
    <AppScreen backgroundColor="#111318" edges={["top", "bottom"]} style={styles.screen}>
      <ImageBackground source={{ uri: slide.image }} style={styles.image}>
        <View style={styles.overlay}>
          <TouchableOpacity activeOpacity={0.75} onPress={completeOnboarding}>
            <Text style={styles.skip}>{t("skip")}</Text>
          </TouchableOpacity>

          <View style={styles.copyWrap}>
            <Text style={styles.title}>
              {t(slide.titleKey as TranslationKey)}
            </Text>
            <Text style={styles.description}>
              {t(slide.descriptionKey as TranslationKey)}
            </Text>
            <View style={styles.dots}>
              {onboardingSlides.map((item, dotIndex) => (
                <View
                  key={item.id}
                  style={[
                    styles.dot,
                    dotIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>

          <CustomButton
            title={isLast ? t("getStarted") : t("next")}
            onPress={handleNext}
            style={styles.button}
          />
        </View>
      </ImageBackground>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: "#FF6320",
    width: 36,
  },
  button: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  copyWrap: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  description: {
    color: "#E6E7EA",
    fontSize: 16,
    lineHeight: 23,
    marginTop: spacing.md,
    textAlign: "center",
  },
  dot: {
    borderRadius: radius.pill,
    height: 7,
    marginHorizontal: 3,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  errorBlock: {
    alignItems: "center",
  },
  errorContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  errorMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  image: {
    flex: 1,
  },
  inactiveDot: {
    backgroundColor: "#CAE9FF",
    width: 12,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.28)",
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacing.lg,
  },
  retryButton: {
    alignSelf: "stretch",
    marginTop: spacing.xl,
  },
  screen: {
    backgroundColor: "#111318",
  },
  skip: {
    alignSelf: "flex-end",
    color: "#CAE9FF",
    fontSize: 16,
    fontWeight: "800",
    paddingHorizontal: spacing.lg,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 38,
    textAlign: "center",
  },
});
