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

    const email = String(req.body.email).trim().toLowerCase();
    const name = String(req.body.name).trim();
    const user = await store.registerUser({
      email,
      name,
      password: req.body.password,
    });
    const otp = await store.setEmailVerificationOtp(user.id);

    if (!otp) {
      await store.deleteUserById(user.id);
      return res.status(500).json({
        error: "Error",
        message: "Unable to create OTP for this account.",
      });
    }

    const emailResult = await sendOtpEmail({
      name: user.name,
      otp,
      purpose: "signup",
      to: user.email,
    });

    if (!emailResult.sent) {
      await store.deleteUserById(user.id);
      return res.status(502).json({
        error: "Bad Gateway",
        message: "Unable to send OTP email. Please check backend mail settings.",
        reason: emailResult.reason,
      });
    }

    res.status(201).json({
      data: await buildAuthResponse(user),
      emailVerification: {
        otpSent: true,
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

    const user = await store.findUserByEmail(
      String(req.body.email).trim().toLowerCase(),
    );

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

    const email = String(req.body.email).trim().toLowerCase();
    const otp = await store.setResetOtp(email);
    const user = await store.findUserByEmail(email);
    const emailResult = otp
      ? await sendOtpEmail({
          name: user?.name,
          otp,
          purpose: "password_reset",
          to: email,
        })
      : {
          sent: false,
        };

    res.json({
      data: {
        email,
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

    const result = await store.verifyOtp(
      String(req.body.email).trim().toLowerCase(),
      req.body.code,
    );

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
