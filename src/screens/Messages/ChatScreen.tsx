import React, { useMemo, useState } from "react";
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
import { useLocalSearchParams } from "expo-router";
import { AppScreen } from "@/src/components/common/AppScreen";
import { IconButton } from "@/src/components/common/IconButton";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { chatMessages, chatPreviews } from "@/src/data/travelData";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { radius, spacing } from "@/src/theme";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [draft, setDraft] = useState("");
  const { theme } = useAppTheme();
  const { t } = useLocalization();
  const chat = chatPreviews.find((item) => item.id === id) ?? chatPreviews[0];
  const messages = useMemo(
    () => chatMessages.filter((message) => message.chatId === chat.id),
    [chat.id],
  );

  return (
    <AppScreen edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <AppHeader
          title={chat.name}
          subtitle={chat.online ? t("activeNow") : ""}
          right={<IconButton name="call-outline" accessibilityLabel="Call" />}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messages}
        >
          <Text style={[styles.today, { color: theme.colors.textMuted }]}>
            {t("today")}
          </Text>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                message.fromMe ? styles.myMessageRow : styles.otherMessageRow,
              ]}
            >
              {!message.fromMe ? (
                <Image source={{ uri: chat.avatar }} style={styles.avatar} />
              ) : null}
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: message.fromMe
                      ? theme.colors.bubbleMine
                      : theme.colors.bubbleOther,
                  },
                ]}
              >
                <Text style={[styles.messageText, { color: theme.colors.text }]}>
                  {message.text}
                </Text>
                <Text style={[styles.time, { color: theme.colors.textMuted }]}>
                  {message.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={[styles.composer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.inputWrap, { backgroundColor: theme.colors.input }]}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={t("typeMessage")}
              placeholderTextColor={theme.colors.textMuted}
              style={[styles.input, { color: theme.colors.text }]}
            />
            <Ionicons name="attach-outline" size={20} color={theme.colors.icon} />
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
          >
            <Ionicons
              name={draft.trim() ? "send" : "mic"}
              size={20}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: radius.pill,
    height: 34,
    marginRight: spacing.sm,
    width: 34,
  },
  bubble: {
    borderRadius: radius.lg,
    maxWidth: "76%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  composer: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  inputWrap: {
    alignItems: "center",
    borderRadius: radius.md,
    flex: 1,
    flexDirection: "row",
    minHeight: 48,
    paddingHorizontal: spacing.md,
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
    fontSize: 13,
    lineHeight: 19,
  },
  messages: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  myMessageRow: {
    justifyContent: "flex-end",
  },
  otherMessageRow: {
    justifyContent: "flex-start",
  },
  sendButton: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 48,
    justifyContent: "center",
    marginLeft: spacing.sm,
    width: 48,
  },
  time: {
    alignSelf: "flex-end",
    fontSize: 10,
    marginTop: spacing.xs,
  },
  today: {
    alignSelf: "center",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: spacing.lg,
  },
});
