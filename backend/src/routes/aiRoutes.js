const express = require("express");
const { getTravelSuggestion } = require("../services/travelAiService");

const router = express.Router();

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

    res.json({
      data: suggestion,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
