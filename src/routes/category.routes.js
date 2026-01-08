const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

const {
  createCategory,
  getCategories,
  getCategoriesById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

router.post("/", protect, authorizeRoles("admin"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoriesById);
router.patch("/:id", protect, authorizeRoles("admin"), updateCategory);
router.delete("/:id", protect, authorizeRoles("admin"), deleteCategory);

module.exports = router;
