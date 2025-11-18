const User = require('../models/user.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

// Helper function to validate product ID
async function validateProduct(productId) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return { error: "Invalid Product ID format." };
  }
  const product = await Product.findById(productId);
  if (!product) {
    return { error: "Product not found." };
  }
  return { product };
}

// GET /cart: Fetch the user's cart
exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('cart.productId');
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    res.status(200).json(user.cart);
  } catch (err) {
    next(err);
  }
};

// POST /cart: Add a product to the cart
exports.addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).send({ message: "ProductId and quantity are required." });
  }
  if (typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).send({ message: "Quantity must be a positive number." });
  }

  try {
    // 1. Fetch the product details to check stock
    const { product, error } = await validateProduct(productId);
    if (error) {
      return res.status(404).send({ message: error });
    }

    const user = await User.findById(req.userId);
    const cartItemIndex = user.cart.findIndex(item => item.productId.equals(productId));

    // 2. Calculate the final quantity the user wants
    let finalQuantity = quantity;
    if (cartItemIndex > -1) {
      // If item exists, add new quantity to existing quantity
      finalQuantity += user.cart[cartItemIndex].quantity;
    }

    // 3. --- STOCK CHECK ---
    if (finalQuantity > product.stockQuantity) {
      return res.status(400).send({ 
        message: `Insufficient stock. You requested ${finalQuantity}, but only ${product.stockQuantity} are available.` 
      });
    }

    // 4. Proceed to update cart
    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = finalQuantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.status(200).send({ message: "Product added to cart.", cart: user.cart });

  } catch (err) {
    next(err);
  }
};

// PUT /cart/:productId: Update quantity
exports.updateCartItem = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).send({ message: "Quantity must be a positive number." });
  }

  try {
    const user = await User.findById(req.userId);
    const cartItemIndex = user.cart.findIndex(item => item.productId.equals(productId));

    if (cartItemIndex === -1) {
      return res.status(404).send({ message: "Product not in cart." });
    }

    // 1. Fetch product to check stock availability
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).send({ message: "Product details not found." });
    }

    // 2. --- STOCK CHECK ---
    if (quantity > product.stockQuantity) {
      return res.status(400).send({ 
        message: `Insufficient stock. You cannot have ${quantity} items. Only ${product.stockQuantity} available.` 
      });
    }

    // 3. Update and Save
    user.cart[cartItemIndex].quantity = quantity;
    await user.save();
    res.status(200).json(user.cart);

  } catch (err) {
    next(err);
  }
};

// DELETE /cart/:productId: Remove from cart
exports.removeFromCart = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { cart: { productId: productId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    
    res.status(200).json(user.cart);
  } catch (err) {
    next(err);
  }
};