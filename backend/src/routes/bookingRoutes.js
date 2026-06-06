const express = require("express");
const { requireAuth } = require("../middleware/auth");
const store = require("../store/mongoStore");
const { validateFutureTravelDate } = require("../utils/date");

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    res.json({
      data: await store.listBookings(req.user.id),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!String(req.body.placeId ?? "").trim()) {
      return res.status(400).json({
        error: "Bad Request",
        message: "placeId is required",
      });
    }

    const travelDateValidation = validateFutureTravelDate(req.body.travelDate);

    if (!travelDateValidation.isValid) {
      return res.status(400).json({
        error: "Bad Request",
        message: travelDateValidation.message,
      });
    }

    const booking = await store.createBooking(req.user.id, {
      ...req.body,
      travelDate: travelDateValidation.value,
    });

    if (!booking) {
      return res.status(404).json({
        error: "Not Found",
        message: "Place not found",
      });
    }

    res.status(201).json({
      data: booking,
      message: "Booking confirmed",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
