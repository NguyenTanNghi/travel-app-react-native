const express = require("express");
const store = require("../store/mongoStore");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.json({
      data: await store.listTripPackages({
        placeId: req.query.placeId,
      }),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:packageId", async (req, res, next) => {
  try {
    const tripPackage = await store.getTripPackageById(req.params.packageId);

    if (!tripPackage) {
      return res.status(404).json({
        error: "Not Found",
        message: "Trip package not found",
      });
    }

    res.json({
      data: tripPackage,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
