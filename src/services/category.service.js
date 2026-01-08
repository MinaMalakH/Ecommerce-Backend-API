const Category = require("../models/Category");
const slugify = require("slugify");

exports.createCategoryService = async (name, description, parent) => {
  const category = new Category({
    name,
    description,
    parent: parent || null,
    slug: slugify(name, { lower: true, strict: true }),
  });
  await category.save();
  return category;
};

exports.getAllCategories = async () => {
  return await Category.find({ isActive: true }).populate("parent");
};

exports.getCategoryById = async (id) => {
  return await Category.findById(id).populate("parent");
};

exports.updateCategory = async (id, updates) => {
  // Generate slug if name is being updated
  if (updates.name) {
    updates.slug = slugify(updates.name, { lower: true, strict: true });
  }
  return await Category.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate("parent");
};
exports.deleteCategory = async (id) => {
  return await Category.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
};
