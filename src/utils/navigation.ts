import { router, type Href } from "expo-router";

export function navigateTo(href: string) {
  router.push(href as unknown as Href);
}

export function replaceWith(href: string) {
  router.replace(href as unknown as Href);
}

export function navigateToPlace(placeId: string) {
  router.push({
    pathname: "/Details",
    params: { id: placeId },
  } as unknown as Href);
}

export function navigateToChat(chatId: string) {
  router.push({
    pathname: "/Chat",
    params: { id: chatId },
  } as unknown as Href);
}
