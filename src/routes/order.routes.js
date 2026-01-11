const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");

router.post("/", protect, createOrder);
router.get("/me", protect, getMyOrders);

router.get("/", protect, authorizeRoles("admin"), getAllOrders);
router.patch("/:id", protect, authorizeRoles("admin"), updateOrderStatus);

module.exports = router;
