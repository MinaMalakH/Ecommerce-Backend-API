const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {
  getOverviewStats,
  orderByStatus,
  monthlyRevenue,
  topSellingProducts,
} = require("../controllers/admin.controller");

router.get(
  "/analytics/overview",
  protect,
  authorizeRoles("admin"),
  getOverviewStats
);
router.get(
  "/analytics/order-by-status",
  protect,
  authorizeRoles("admin"),
  orderByStatus
);
router.get(
  "/analytics/monthly-revenue",
  protect,
  authorizeRoles("admin"),
  monthlyRevenue
);
router.get(
  "/analytics/top-products",
  protect,
  authorizeRoles("admin"),
  topSellingProducts
);

module.exports = router;
