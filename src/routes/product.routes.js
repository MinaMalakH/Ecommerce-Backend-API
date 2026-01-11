const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const uploadSingleImage = require("../middlewares/upload.middleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  uploadSingleImage.single("image"),
  createProduct
);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.patch("/:id", protect, authorizeRoles("admin"), updateProduct);
router.delete("/:id", protect, authorizeRoles("admin"), deleteProduct);

module.exports = router;
