const nodemailer = require("nodemailer");

const DEFAULT_MAIL_TIMEOUT_MS = 12000;

function getMailTimeoutMs() {
  const configuredTimeout = Number(process.env.MAIL_TIMEOUT_MS);

  return Number.isFinite(configuredTimeout) && configuredTimeout > 0
    ? configuredTimeout
    : DEFAULT_MAIL_TIMEOUT_MS;
}

function buildTransporter() {
  const user = process.env.MAIL_USERNAME;
  const pass = process.env.MAIL_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    auth: {
      pass,
      user,
    },
    connectionTimeout: getMailTimeoutMs(),
    greetingTimeout: getMailTimeoutMs(),
    service: process.env.MAIL_SERVICE ?? "gmail",
    socketTimeout: getMailTimeoutMs(),
  });
}

function buildOtpSubject(purpose) {
  if (purpose === "email_change") {
    return "Verify your new email address";
  }

  if (purpose === "password_reset") {
    return "Reset your Travel App password";
  }

  return "Verify your Travel App account";
}

function buildOtpMessage({ name, otp, purpose }) {
  const greeting = name ? `Hi ${name},` : "Hi,";
  const action =
    purpose === "email_change"
      ? "confirm your new email address"
      : purpose === "password_reset"
        ? "reset your password"
        : "finish creating your account";

  return `${greeting}\n\nYour Travel App OTP is ${otp}. Use this code to ${action}.\n\nThis code should be kept private.`;
}

async function sendOtpEmail({ name, otp, purpose = "signup", to }) {
  const transporter = buildTransporter();

  if (!transporter) {
    console.warn("MAIL_USERNAME or MAIL_PASSWORD is missing. OTP email was not sent.");
    return {
      reason: "missing_mail_credentials",
      sent: false,
    };
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM ?? process.env.MAIL_USERNAME,
      subject: buildOtpSubject(purpose),
      text: buildOtpMessage({ name, otp, purpose }),
      to,
    });

    return {
      sent: true,
    };
  } catch (error) {
    console.error("Unable to send OTP email:", error.message);
    return {
      reason: "send_failed",
      sent: false,
    };
  }
}

module.exports = {
  sendOtpEmail,
};
