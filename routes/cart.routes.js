const express = require('express');
const router = express.Router();
const controller = require('../controllers/cart.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// PROTECT ALL ROUTES IN THIS FILE
router.use(verifyToken);

router.get('/', controller.getCart);
router.post('/', controller.addToCart);
router.put('/:productId', controller.updateCartItem);
router.delete('/:productId', controller.removeFromCart);

module.exports = router;