const express = require("express");
const store = require("../store/mongoStore");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.json({
      data: await store.listNotifications({
        status: req.query.status,
      }),
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    res.json({
      data: await store.clearNotifications(req.query.status),
      message: "Notifications cleared",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
