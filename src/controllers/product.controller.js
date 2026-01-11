const productService = require("../services/product.service");
const cloudinary = require("../config/cloudinary");

exports.createProduct = async (req, res) => {
  try {
    // Log to debug
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { name, description, price, discountPrice, stock, category } =
      req.body;

    // Validate required fields
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, description, price, stock, category",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product Image is Required",
      });
    }
    const product = await productService.createProduct(
      name,
      description,
      Number(price),
      discountPrice ? Number(discountPrice) : undefined,
      Number(stock),
      category,
      req.file,
      req.user._id
    );
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      minRating,
      page = 1,
      limit = 10,
    } = req.query;
    const result = await productService.getAllActiveProducts(
      keyword,
      category,
      minPrice,
      maxPrice,
      minRating,
      page,
      limit
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updates = req.body;
    const newProduct = await productService.updateProduct(
      req.params.id,
      updates
    );
    res.status(200).json({ success: true, newProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productService.deactivateProduct(req.params.id);
    res.status(200).json({ success: true, message: "Product deactivated" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
