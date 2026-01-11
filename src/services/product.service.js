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
  file,
  userId
) => {
  // 1. Business Logic: Validate Category
  const categoryExists = await Category.findById(category);
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
    slug: slugify(name),
    image: {
      url: file.path,
      publicId: file.filename,
    },
    createdBy: userId,
  });
  await product.save();
  return product;
};

exports.getAllActiveProducts = async (
  keyword,
  category,
  minPrice,
  maxPrice,
  minRating,
  page,
  limit
) => {
  const filter = { isActive: true };
  if (keyword) {
    filter.$text = { $search: keyword };
  }
  if (category) {
    filter.category = category;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (minRating) {
    filter.averageRating = { $gte: Number(minRating) };
  }
  const products = await Product.find(filter)
    .populate("category", "name ")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(filter);

  return {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
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
