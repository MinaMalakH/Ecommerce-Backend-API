const Product = require("../models/Product");
const Order = require("../models/Order");

exports.createOrder = async (items, shoppingAddress, paymentMethod, userId) => {
  let totalAmount = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findOneAndUpdate(
      {
        _id: item.productId,
        stock: { $gte: item.quantity },
      },
      {
        $inc: { stock: -item.quantity },
      },
      { new: true }
    );

    if (!product) {
      throw new Error(" Product out of stock or not found");
    }

    const price = product.discountPrice || product.price;
    totalAmount += price * item.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      price,
      quantity: item.quantity,
      image: product.image.url,
    });
  }
  const order = await Order.create({
    userId: userId,
    items: orderItems,
    totalAmount,
    shoppingAddress,
    paymentMethod,
  });
  return order;
};

exports.getMyOrders = async (id) => {
  return await Order.find({ userId: id }).sort({ createdAt: -1 });
};

exports.getAllOrders = async () => {
  return await Order.find().populate("user", "email").sort({ createdAt: -1 });
};

exports.updateOrderStatus = async (id, status) => {
  return await Order.findByIdAndUpdate(id, { status }, { new: true });
};
