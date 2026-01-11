const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { createReview } = require("../controllers/review.controller");

router.post("/:productId", protect, createReview);

module.exports = router;
