import { travelApi, type AiTravelPayload } from "@/src/services/travelApi";
import type { LanguageCode } from "@/src/types";

type AiTravelRequest = {
  prompt: string;
  language: LanguageCode;
};

export async function getAiTravelSuggestion(
  request: AiTravelRequest,
): Promise<AiTravelPayload> {
  return travelApi.getAiTravelSuggestion(request);
}
