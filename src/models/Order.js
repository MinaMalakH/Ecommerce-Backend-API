const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      address: String,
      city: String,
      country: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card"],
      default: "cod",
    },
    paidAt: Date,
  },
  { timestamps: true }
);
orderSchema.pre("save", function (next) {
  // Validate status transitions
  if (this.status === "delivered" && !this.paidAt) {
    return next(new Error("Order must be paid before marking as delivered"));
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
