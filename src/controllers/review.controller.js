const reviewService = require("../services/review.service");

exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const review = await reviewService.createReview(
      req.user._id,
      productId,
      rating,
      comment
    );
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
