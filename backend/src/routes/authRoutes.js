const express = require("express");
const { sendOtpEmail } = require("../services/emailService");
const store = require("../store/mongoStore");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function requireFields(body, fields) {
  const missingFields = fields.filter((field) => !String(body[field] ?? "").trim());

  if (missingFields.length > 0) {
    const error = new Error(`Missing fields: ${missingFields.join(", ")}`);
    error.status = 400;
    throw error;
  }
}

async function buildAuthResponse(user) {
  const token = await store.createSession(user.id);

  return {
    token,
    user: store.sanitizeUser(user),
  };
}

router.post("/sign-up", async (req, res, next) => {
  try {
    requireFields(req.body, ["email", "name", "password"]);

    const user = await store.registerUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    });
    const otp = await store.setEmailVerificationOtp(user.id);
    const emailResult = await sendOtpEmail({
      name: user.name,
      otp,
      purpose: "signup",
      to: user.email,
    });

    res.status(201).json({
      data: await buildAuthResponse(user),
      emailVerification: {
        otpSent: emailResult.sent,
        reason: emailResult.reason,
      },
      message: "Account created. Please verify your email.",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/sign-in", async (req, res, next) => {
  try {
    requireFields(req.body, ["email", "password"]);

    const user = await store.findUserByEmail(req.body.email);

    if (!user || user.password !== req.body.password) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    res.json({
      data: await buildAuthResponse(user),
      message: "Signed in",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    requireFields(req.body, ["email"]);

    const otp = await store.setResetOtp(req.body.email);
    const user = await store.findUserByEmail(req.body.email);
    const emailResult = otp
      ? await sendOtpEmail({
          name: user?.name,
          otp,
          purpose: "password_reset",
          to: req.body.email,
        })
      : {
          sent: false,
        };

    res.json({
      data: {
        email: req.body.email,
        sent: emailResult.sent,
      },
      message: "If the account exists, a reset code has been sent",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/verify-otp", async (req, res, next) => {
  try {
    requireFields(req.body, ["code", "email"]);

    const result = await store.verifyOtp(req.body.email, req.body.code);

    if (!result) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid verification code",
      });
    }

    res.json({
      data: {
        purpose: result.purpose,
        user: store.sanitizeUser(result.user),
        verified: true,
      },
      message: "Code verified",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/sign-out", requireAuth, async (req, res, next) => {
  try {
    await store.destroySession(req.authToken);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
