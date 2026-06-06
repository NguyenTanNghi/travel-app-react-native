const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { sendOtpEmail } = require("../services/emailService");
const store = require("../store/mongoStore");

const router = express.Router();

router.use(requireAuth);

router.get("/me", (req, res) => {
  res.json({
    data: store.sanitizeUser(req.user),
  });
});

router.patch("/me", async (req, res, next) => {
  try {
    const result = await store.updateUser(req.user.id, req.body);

    if (!result) {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found",
      });
    }

    let emailVerification = null;

    if (result.emailVerificationOtp) {
      const emailResult = await sendOtpEmail({
        name: result.user.name,
        otp: result.emailVerificationOtp,
        purpose: "email_change",
        to: result.user.email,
      });

      if (!emailResult.sent) {
        await store.restoreUserEmail(req.user.id, req.user);
        return res.status(502).json({
          error: "Bad Gateway",
          message: "Unable to send OTP email. Please check backend mail settings.",
          reason: emailResult.reason,
        });
      }

      emailVerification = {
        otpSent: true,
      };
    }

    res.json({
      data: store.sanitizeUser(result.user),
      emailVerification,
      message: emailVerification
        ? "Profile updated. Please verify your new email."
        : "Profile updated",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me/favorites", async (req, res, next) => {
  try {
    res.json({
      data: {
        favoritePlaceIds: await store.getFavoritePlaceIds(req.user.id),
        places: await store.listFavoritePlaces(req.user.id),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/me/favorites/:placeId", async (req, res, next) => {
  try {
    const result = await store.addFavorite(req.user.id, req.params.placeId);

    if (!result) {
      return res.status(404).json({
        error: "Not Found",
        message: "Place not found",
      });
    }

    res.status(201).json({
      data: result,
      message: "Favorite added",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/me/favorites/:placeId", async (req, res, next) => {
  try {
    const result = await store.removeFavorite(req.user.id, req.params.placeId);

    if (!result) {
      return res.status(404).json({
        error: "Not Found",
        message: "Place not found",
      });
    }

    res.json({
      data: result,
      message: "Favorite removed",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/me/favorites/:placeId/toggle", async (req, res, next) => {
  try {
    const result = await store.toggleFavorite(req.user.id, req.params.placeId);

    if (!result) {
      return res.status(404).json({
        error: "Not Found",
        message: "Place not found",
      });
    }

    res.json({
      data: result,
      message: "Favorite updated",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
