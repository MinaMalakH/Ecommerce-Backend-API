const adminService = require("../services/admin.service");

exports.getOverviewStats = async (req, res) => {
  try {
    const result = await adminService.getOverviewStats();
    res.status(200).json({ ...result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.orderByStatus = async (req, res) => {
  try {
    const stats = await adminService.orderByStatus();
    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.monthlyRevenue = async (req, res) => {
  try {
    const result = await adminService.monthlyRevenue();
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.topSellingProducts = async (req, res) => {
  try {
    const products = await adminService.topSellingProducts();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
