const productService = require("../services/product.service");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, stock, category, images } =
      req.body;
    const product = productService.createProduct(
      name,
      description,
      price,
      discountPrice,
      stock,
      category,
      images,
      req.user._id
    );
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = productService.getAllActiveProducts();
    res.status(200).json({ success: true, products });
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
    res.status(200).json({ success: true, product });
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
