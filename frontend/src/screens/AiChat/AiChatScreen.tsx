import React, { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "@/src/components/common/AppScreen";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { getAiTravelSuggestion } from "@/src/services/aiTravelService";
import { useAppContext } from "@/src/store/AppContext";
import { useNavigation } from "@/src/navigation/NavigationContext";
import { radius, spacing } from "@/src/theme";
import { formatCurrency } from "@/src/utils/format";
import type { AiChatMessage, Place } from "@/src/types";

function getCurrentTime() {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

function RecommendedPlaceCard({
  onPress,
  place,
}: {
  onPress: () => void;
  place: Place;
}) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.placeCard,
        { backgroundColor: theme.colors.surfaceRaised },
      ]}
    >
      <Image source={{ uri: place.image }} style={styles.placeImage} />
      <View style={styles.placeInfo}>
        <Text numberOfLines={1} style={[styles.placeTitle, { color: theme.colors.text }]}>
          {place.title}
        </Text>
        <View style={styles.placeMetaRow}>
          <Ionicons name="location-outline" size={13} color={theme.colors.icon} />
          <Text
            numberOfLines={1}
            style={[styles.placeMeta, { color: theme.colors.textMuted }]}
          >
            {place.country}
          </Text>
        </View>
        <Text style={[styles.placePrice, { color: theme.colors.primary }]}>
          {formatCurrency(place.price)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function AiChatScreen() {
  const [draft, setDraft] = useState("");
  const [isThinking, setThinking] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const { theme } = useAppTheme();
  const { language, t } = useLocalization();
  const { navigate } = useNavigation();
  const { aiChatMessages: messages, setAiChatMessages } = useAppContext();

  const quickPrompts = [
    t("aiQuickBeach"),
    t("aiQuickBudget"),
    t("aiQuickPacking"),
    t("aiQuickVietnam"),
  ];

  const sendPrompt = (prompt: string) => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isThinking) {
      return;
    }

    const time = getCurrentTime();
    const userMessage: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmedPrompt,
      time,
    };

    setAiChatMessages((current) => [...current, userMessage]);
    setDraft("");
    setThinking(true);

    setTimeout(() => {
      void getAiTravelSuggestion({
        language,
        prompt: trimmedPrompt,
      })
        .then((reply) => {
          const assistantMessage: AiChatMessage = {
            id: `assistant-${Date.now()}`,
            recommendedPlaces: reply.places ?? [],
            role: "assistant",
            text: reply.text,
            time: getCurrentTime(),
          };

          setAiChatMessages((current) => [...current, assistantMessage]);
          requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
        })
        .finally(() => {
          setThinking(false);
        });
    }, 650);
  };

  return (
    <AppScreen edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <AppHeader
          title={t("aiChat")}
          showBack={false}
          right={
            <View style={[styles.aiIcon, { backgroundColor: theme.colors.primarySoft }]}>
              <Ionicons name="sparkles" size={20} color={theme.colors.primary} />
            </View>
          }
        />
        <View style={styles.intro}>
          <Text style={[styles.introTitle, { color: theme.colors.text }]}>
            {t("aiTravelAssistant")}
          </Text>
          <Text style={[styles.introText, { color: theme.colors.textMuted }]}>
            {t("aiChatSubtitle")}
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  isUser ? styles.userRow : styles.assistantRow,
                ]}
              >
                {!isUser ? (
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: theme.colors.primarySoft },
                    ]}
                  >
                    <Ionicons
                      name="sparkles"
                      size={16}
                      color={theme.colors.primary}
                    />
                  </View>
                ) : null}
                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: isUser
                        ? theme.colors.bubbleMine
                        : theme.colors.bubbleOther,
                    },
                  ]}
                >
                  <Text style={[styles.messageText, { color: theme.colors.text }]}>
                    {message.text}
                  </Text>
                  {!isUser && message.recommendedPlaces?.length ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.placeScroller}
                    >
                      {message.recommendedPlaces.map((place) => (
                        <RecommendedPlaceCard
                          key={place.id}
                          place={place}
                          onPress={() => navigate("Details", { placeId: place.id })}
                        />
                      ))}
                    </ScrollView>
                  ) : null}
                  <Text style={[styles.time, { color: theme.colors.textMuted }]}>
                    {message.time}
                  </Text>
                </View>
              </View>
            );
          })}
          {isThinking ? (
            <Text style={[styles.thinking, { color: theme.colors.textMuted }]}>
              {t("aiThinking")}...
            </Text>
          ) : null}
        </ScrollView>

        <View style={styles.quickPromptRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickPrompts.map((prompt) => (
              <TouchableOpacity
                key={prompt}
                activeOpacity={0.8}
                onPress={() => sendPrompt(prompt)}
                style={[
                  styles.quickPrompt,
                  {
                    backgroundColor: theme.colors.primarySoft,
                    borderColor: theme.colors.primary,
                  },
                ]}
              >
                <Text style={[styles.quickPromptText, { color: theme.colors.primary }]}>
                  {prompt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.composerArea}>
          <View style={[styles.inputWrap, { backgroundColor: theme.colors.input }]}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={t("askAiPlaceholder")}
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.input, { color: theme.colors.text }]}
              multiline
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => sendPrompt(draft)}
            style={[
              styles.sendButton,
              {
                backgroundColor: theme.colors.primary,
                opacity: draft.trim() ? 1 : 0.56,
              },
            ]}
          >
            <Ionicons name="send" size={18} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  aiIcon: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  assistantRow: {
    justifyContent: "flex-start",
  },
  avatar: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 32,
    justifyContent: "center",
    marginRight: spacing.sm,
    width: 32,
  },
  bubble: {
    borderRadius: radius.lg,
    maxWidth: "78%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  composerArea: {
    alignItems: "flex-end",
    flexDirection: "row",
    marginBottom: 116,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    maxHeight: 92,
    minHeight: 22,
  },
  inputWrap: {
    borderRadius: radius.md,
    flex: 1,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  intro: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: "900",
  },
  keyboard: {
    flex: 1,
  },
  messageRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messages: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  quickPrompt: {
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  quickPromptRow: {
    paddingLeft: spacing.lg,
    paddingVertical: spacing.xs,
  },
  quickPromptText: {
    fontSize: 12,
    fontWeight: "800",
  },
  sendButton: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 48,
    justifyContent: "center",
    marginLeft: spacing.sm,
    width: 48,
  },
  thinking: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  time: {
    alignSelf: "flex-end",
    fontSize: 10,
    marginTop: spacing.xs,
  },
  userRow: {
    justifyContent: "flex-end",
  },
  placeCard: {
    borderRadius: radius.md,
    marginRight: spacing.sm,
    overflow: "hidden",
    width: 148,
  },
  placeImage: {
    height: 84,
    width: "100%",
  },
  placeInfo: {
    padding: spacing.xs,
  },
  placeMeta: {
    flex: 1,
    fontSize: 11,
    marginLeft: spacing.xxs,
  },
  placeMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: spacing.xxs,
  },
  placePrice: {
    fontSize: 12,
    fontWeight: "900",
    marginTop: spacing.xxs,
  },
  placeScroller: {
    marginTop: spacing.sm,
  },
  placeTitle: {
    fontSize: 12,
    fontWeight: "900",
  },
});
