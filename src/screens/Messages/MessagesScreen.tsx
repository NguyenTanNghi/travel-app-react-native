import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppScreen } from "@/src/components/common/AppScreen";
import { BottomTabBar } from "@/src/components/common/BottomTabBar";
import { IconButton } from "@/src/components/common/IconButton";
import { SearchBar } from "@/src/components/common/SearchBar";
import { ChatPreviewCard } from "@/src/components/cards/ChatPreviewCard";
import { AppHeader } from "@/src/components/headers/AppHeader";
import { SectionHeader } from "@/src/components/sections/SectionHeader";
import { chatPreviews } from "@/src/data/travelData";
import { useLocalization } from "@/src/hooks/useLocalization";
import { navigateToChat } from "@/src/utils/navigation";
import { spacing } from "@/src/theme";

export default function MessagesScreen() {
  const [query, setQuery] = useState("");
  const { t } = useLocalization();
  const filteredChats = chatPreviews.filter((chat) =>
    [chat.name, chat.lastMessage].join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AppScreen scroll contentContainerStyle={styles.content}>
      <AppHeader
        title={t("messages")}
        right={<IconButton name="create-outline" accessibilityLabel="Compose message" />}
      />
      <View style={styles.body}>
        <SectionHeader title={t("messages")} />
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t("searchChats")}
        />
        <View style={styles.list}>
          {filteredChats.map((chat) => (
            <ChatPreviewCard
              key={chat.id}
              item={chat}
              onPress={() => navigateToChat(chat.id)}
            />
          ))}
        </View>
      </View>
      <BottomTabBar active="messages" />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingTop: spacing.sm,
  },
  list: {
    marginTop: spacing.xl,
  },
});
