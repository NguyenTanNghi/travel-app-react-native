const cors = require("cors");
const express = require("express");

const aiRoutes = require("./routes/aiRoutes");
const appContentRoutes = require("./routes/appContentRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const placeRoutes = require("./routes/placeRoutes");
const tripPackageRoutes = require("./routes/tripPackageRoutes");
const userRoutes = require("./routes/userRoutes");
const { errorHandler, notFound } = require("./middleware/errors");

function createCorsOptions() {
  const configuredOrigin = process.env.CORS_ORIGIN;

  if (!configuredOrigin || configuredOrigin === "*") {
    return {
      origin: true,
    };
  }

  return {
    origin: configuredOrigin.split(",").map((origin) => origin.trim()),
  };
}

const app = express();

app.use(cors(createCorsOptions()));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    data: {
      service: "travel-app-api",
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/app-content", appContentRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/trip-packages", tripPackageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
