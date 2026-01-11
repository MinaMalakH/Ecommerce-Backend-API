const Review = require("../models/Review");
const Product = require("../models/Product");

exports.createReview = async (userId, productId, rating, comment) => {
  const review = await Review.create({
    userId: userId,
    productId: productId,
    rating: rating,
    comment: comment,
  });

  const stats = await Review.aggregate([
    {
      $match: { productId: new mongoose.Types.ObjectId(review.productId) },
    },
    {
      $group: {
        _id: "$productId",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: stats[0].avgRating,
      reviewsCount: stats[0].count,
    });
  }
  return review;
};
