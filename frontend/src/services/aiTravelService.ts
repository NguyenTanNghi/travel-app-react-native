import type { LanguageCode } from "@/src/types";

type AiTravelRequest = {
  prompt: string;
  language: LanguageCode;
};

type AiTravelResponse = {
  text: string;
  source: "proxy" | "local";
};

const aiProxyUrl = process.env.EXPO_PUBLIC_AI_PROXY_URL;

function buildLocalTravelReply(prompt: string, language: LanguageCode) {
  const normalizedPrompt = prompt.toLowerCase();
  const isVietnamese = language === "vi";

  if (normalizedPrompt.includes("pack") || normalizedPrompt.includes("hành lý")) {
    return isVietnamese
      ? "Checklist nhanh: giấy tờ, sạc dự phòng, thuốc cá nhân, kem chống nắng, áo khoác nhẹ, giày đi bộ và một túi chống nước. Nếu đi biển, thêm đồ bơi và dép nhẹ."
      : "Quick packing list: documents, power bank, personal medicine, sunscreen, a light jacket, walking shoes, and a waterproof pouch. For beach trips, add swimwear and sandals.";
  }

  if (
    normalizedPrompt.includes("budget") ||
    normalizedPrompt.includes("cheap") ||
    normalizedPrompt.includes("tiết kiệm")
  ) {
    return isVietnamese
      ? "Gợi ý chuyến tiết kiệm: chọn homestay trung tâm, đặt vé sớm, ưu tiên ăn địa phương, đi bộ hoặc dùng phương tiện công cộng. Với 3 ngày, hãy giữ lịch trình 2-3 điểm chính để không tốn chi phí di chuyển."
      : "For a budget trip: book central homestays early, eat local, walk or use public transport, and keep the plan to 2-3 key spots over 3 days to avoid transport costs.";
  }

  if (
    normalizedPrompt.includes("vietnam") ||
    normalizedPrompt.includes("việt nam") ||
    normalizedPrompt.includes("viet nam")
  ) {
    return isVietnamese
      ? "Lịch trình Việt Nam 5 ngày: 2 ngày Hà Nội, 1 ngày Ninh Bình, 2 ngày Hạ Long. Nếu thích biển hơn, đổi Hạ Long thành Đà Nẵng - Hội An."
      : "Vietnam 5-day idea: 2 days in Hanoi, 1 day in Ninh Binh, and 2 days in Ha Long Bay. If you prefer beaches, swap Ha Long for Da Nang and Hoi An.";
  }

  if (
    normalizedPrompt.includes("beach") ||
    normalizedPrompt.includes("island") ||
    normalizedPrompt.includes("biển")
  ) {
    return isVietnamese
      ? "Cuối tuần biển gọn nhẹ: ngày 1 check-in và ngắm hoàng hôn, ngày 2 tour đảo hoặc snorkeling, sáng ngày 3 cafe biển rồi về. Nên đặt khách sạn gần bãi chính để tiết kiệm thời gian."
      : "Beach weekend plan: day 1 check in and watch sunset, day 2 island tour or snorkeling, day 3 seaside cafe before heading home. Stay near the main beach to save time.";
  }

  return isVietnamese
    ? "Mình có thể giúp bạn lên lịch trình, ước tính ngân sách, chọn điểm đến hoặc chuẩn bị hành lý. Hãy cho mình biết số ngày đi, ngân sách và phong cách du lịch bạn thích."
    : "I can help with itineraries, budget estimates, destination picks, and packing plans. Tell me your trip length, budget, and travel style.";
}

async function requestProxyReply({
  language,
  prompt,
}: AiTravelRequest): Promise<string | null> {
  if (!aiProxyUrl) {
    return null;
  }

  try {
    const response = await fetch(aiProxyUrl, {
      body: JSON.stringify({
        language,
        prompt,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { reply?: string; text?: string };
    return data.reply ?? data.text ?? null;
  } catch {
    return null;
  }
}

export async function getAiTravelSuggestion(
  request: AiTravelRequest,
): Promise<AiTravelResponse> {
  const proxyReply = await requestProxyReply(request);

  if (proxyReply) {
    return {
      source: "proxy",
      text: proxyReply,
    };
  }

  return {
    source: "local",
    text: buildLocalTravelReply(request.prompt, request.language),
  };
}
