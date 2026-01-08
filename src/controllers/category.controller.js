const categoryService = require("../services/category.service");

exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;
    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and Description are Required" });
    }
    const category = await categoryService.createCategoryService(
      name,
      description,
      parent
    );
    res
      .status(201)
      .json({ message: "Category Created Successfully", category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating category: " + error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories: " + error.message });
  }
};

exports.getCategoriesById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const category = await categoryService.getCategoryById(id);
    if (!category || !category.isActive) {
      return res.status(404).json({ message: "Category Not Found" });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching category: " + error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updates = req.body;
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No updates provided" });
    }
    const category = await categoryService.updateCategory(id, updates);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating category: " + error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const category = await categoryService.deleteCategory(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deactivated" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting category: " + error.message,
    });
  }
};
