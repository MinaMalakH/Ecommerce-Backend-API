const Product = require("../models/Product");
const Category = require("../models/Category");
const slugify = require("slugify");

exports.createProduct = async (
  name,
  description,
  price,
  discountPrice,
  stock,
  category,
  images,
  userId
) => {
  const categoryExists = await Category.findOnById(category);
  if (!categoryExists) {
    throw new Error("Invalid Category");
  }

  const product = new Product({
    name,
    description,
    price,
    discountPrice,
    stock,
    category,
    images,
    slug: slugify(productData.name),
    createdBy: userId,
  });
  await product.save();
  return product;
};

exports.getAllActiveProducts = async () => {
  return await Product.find({ isActive: true })
    .populate("category", "name slug")
    .sort({ createdAt: -1 });
};

exports.getProductById = async (id) => {
  const product = await Product.findById(id).populate("category", "name slug");
  if (!product || !product.isActive) {
    throw new Error("Product Not Found");
  }
  return product;
};

exports.updateProduct = async (id, updates) => {
  if (updates.name) {
    updates.slug = slugify(updates.name);
  }
  if (updates.category) {
    const categoryExists = await Category.findById(updates.category);
    if (!categoryExists) {
      throw new Error("Invalid Category");
    }
  }
  return await Product.findByIdAndUpdate(id, updates, { new: true });
};

exports.deactivateProduct = async (id) => {
  return await Product.findByIdAndUpdate(id, { isActive: false });
};
