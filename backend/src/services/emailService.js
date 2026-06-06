const dns = require("dns");
const nodemailer = require("nodemailer");

const DEFAULT_MAIL_TIMEOUT_MS = 12000;

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Older Node versions do not support changing DNS result order.
}

function getMailTimeoutMs() {
  const configuredTimeout = Number(process.env.MAIL_TIMEOUT_MS);

  return Number.isFinite(configuredTimeout) && configuredTimeout > 0
    ? configuredTimeout
    : DEFAULT_MAIL_TIMEOUT_MS;
}

function getPositiveNumber(value, fallback) {
  const number = Number(value);

  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function getBoolean(value, fallback) {
  if (value === undefined) {
    return fallback;
  }

  return ["1", "true", "yes"].includes(String(value).trim().toLowerCase());
}

function buildTransporter() {
  const service = String(process.env.MAIL_SERVICE ?? "gmail").trim();
  const user = process.env.MAIL_USERNAME?.trim();
  const rawPassword = process.env.MAIL_PASSWORD ?? "";
  const pass =
    service.toLowerCase() === "gmail"
      ? rawPassword.replace(/\s/g, "")
      : rawPassword.trim();

  if (!user || !pass) {
    return null;
  }

  const isGmail = service.toLowerCase() === "gmail";
  const host =
    process.env.MAIL_HOST?.trim() || (isGmail ? "smtp.gmail.com" : "");
  const port = getPositiveNumber(
    process.env.MAIL_PORT,
    isGmail ? 587 : 465,
  );
  const secure = getBoolean(process.env.MAIL_SECURE, port === 465);
  const dnsFamily = getPositiveNumber(process.env.MAIL_DNS_FAMILY, 4);
  const baseOptions = {
    auth: {
      pass,
      user,
    },
    connectionTimeout: getMailTimeoutMs(),
    greetingTimeout: getMailTimeoutMs(),
    socketTimeout: getMailTimeoutMs(),
  };

  if (dnsFamily === 4 || dnsFamily === 6) {
    baseOptions.family = dnsFamily;
  }

  if (host) {
    return nodemailer.createTransport({
      ...baseOptions,
      host,
      port,
      requireTLS: getBoolean(process.env.MAIL_REQUIRE_TLS, !secure),
      secure,
      tls: {
        servername: host,
      },
    });
  }

  return nodemailer.createTransport({
    ...baseOptions,
    service,
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
  const from = (process.env.MAIL_FROM ?? process.env.MAIL_USERNAME)?.trim();

  if (!transporter) {
    console.warn("MAIL_USERNAME or MAIL_PASSWORD is missing. OTP email was not sent.");
    return {
      reason: "missing_mail_credentials",
      sent: false,
    };
  }

  try {
    await transporter.sendMail({
      from,
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
