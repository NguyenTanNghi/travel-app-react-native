const express = require("express");
const store = require("../store/mongoStore");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.json({
      data: await store.getAppContent(),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
