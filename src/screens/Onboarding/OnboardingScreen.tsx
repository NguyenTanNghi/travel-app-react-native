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
import { onboardingSlides } from "@/src/data/travelData";
import { useLocalization } from "@/src/hooks/useLocalization";
import { replaceWith } from "@/src/utils/navigation";
import { radius, spacing } from "@/src/theme";
import type { TranslationKey } from "@/src/localization";

type OnboardingScreenProps = {
  initialIndex?: number;
};

export default function OnboardingScreen({ initialIndex = 0 }: OnboardingScreenProps) {
  const [index, setIndex] = useState(initialIndex);
  const { t } = useLocalization();
  const slide = onboardingSlides[index] ?? onboardingSlides[0];
  const isLast = index === onboardingSlides.length - 1;

  const completeOnboarding = () => {
    replaceWith("/SignIn");
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
