const express = require("express");
const { getTravelSuggestion } = require("../services/travelAiService");
const store = require("../store/mongoStore");

const router = express.Router();

function getRecommendationFilters(prompt) {
  const normalizedPrompt = prompt.toLowerCase();

  if (
    normalizedPrompt.includes("beach") ||
    normalizedPrompt.includes("island") ||
    normalizedPrompt.includes("biển") ||
    normalizedPrompt.includes("bien") ||
    normalizedPrompt.includes("đảo") ||
    normalizedPrompt.includes("dao")
  ) {
    return { category: "Beach" };
  }

  if (
    normalizedPrompt.includes("waterfall") ||
    normalizedPrompt.includes("thác") ||
    normalizedPrompt.includes("thac") ||
    normalizedPrompt.includes("fall")
  ) {
    return { category: "Waterfall" };
  }

  if (
    normalizedPrompt.includes("desert") ||
    normalizedPrompt.includes("sa mạc") ||
    normalizedPrompt.includes("sa mac")
  ) {
    return { category: "Desert" };
  }

  if (
    normalizedPrompt.includes("resort") ||
    normalizedPrompt.includes("nghỉ dưỡng") ||
    normalizedPrompt.includes("nghi duong")
  ) {
    return { category: "Resort" };
  }

  if (
    normalizedPrompt.includes("city") ||
    normalizedPrompt.includes("thành phố") ||
    normalizedPrompt.includes("thanh pho") ||
    normalizedPrompt.includes("singapore")
  ) {
    return { category: "City" };
  }

  if (
    normalizedPrompt.includes("mountain") ||
    normalizedPrompt.includes("núi") ||
    normalizedPrompt.includes("nui") ||
    normalizedPrompt.includes("ha long") ||
    normalizedPrompt.includes("hạ long")
  ) {
    return { category: "Mountain" };
  }

  if (
    normalizedPrompt.includes("vietnam") ||
    normalizedPrompt.includes("viet nam") ||
    normalizedPrompt.includes("việt nam")
  ) {
    return { country: "Vietnam" };
  }

  return {};
}

async function getRecommendedPlaces(prompt) {
  const filters = getRecommendationFilters(prompt);
  let places = await store.listPlaces(filters);

  if (places.length === 0) {
    places = await store.listPlaces({ search: prompt });
  }

  if (places.length === 0) {
    places = await store.listPlaces({ popular: true });
  }

  return places.slice(0, 3);
}

router.post("/travel", async (req, res, next) => {
  try {
    const prompt = String(req.body.prompt ?? "").trim();

    if (!prompt) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Prompt is required",
      });
    }

    const suggestion = await getTravelSuggestion({
      language: req.body.language,
      prompt,
    });
    const places = await getRecommendedPlaces(prompt);

    res.json({
      data: {
        ...suggestion,
        places,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
