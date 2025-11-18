const Product = require('../models/product.model');
const mongoose = require('mongoose');

// GET /products: Fetch a list of products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

// GET /products/:id: Fetch details of a single product
exports.getProductById = async (req, res, next) => {
  try {
    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
       return res.status(400).send({ message: "Invalid Product ID format." });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};