const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.getOverviewStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  const revenue = await Order.aggregate([
    { $match: { status: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: revenue[0]?.total || 0,
  };
};

exports.orderByStatus = async () => {
  return await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
};

exports.monthlyRevenue = async () => {
  return await Order.aggregate([
    { $match: { status: "paid" } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        total: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

exports.topSellingProducts = async () => {
  return await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);
};
