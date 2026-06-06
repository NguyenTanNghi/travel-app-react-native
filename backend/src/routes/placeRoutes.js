const express = require("express");
const store = require("../store/mongoStore");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.json({
      data: await store.listPlaces({
        category: req.query.category,
        country: req.query.country,
        popular: req.query.popular,
        search: req.query.search,
      }),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:placeId", async (req, res, next) => {
  try {
    const place = await store.getPlaceById(req.params.placeId);

    if (!place) {
      return res.status(404).json({
        error: "Not Found",
        message: "Place not found",
      });
    }

    res.json({
      data: place,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
