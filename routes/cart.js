const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Lấy giỏ hàng
router.get('/', async (req, res) => {
    const cart = req.session.cart || [];
    let totalAmount = 0;
    let cartCount = 0;
    const cartItems = [];

    for (let item of cart) {
        const product = await Product.findById(item.productId);
        if (product) {
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;
            cartCount += item.quantity;
            cartItems.push({ ...product._doc, quantity: item.quantity });
        }
    }

    res.render('cart', { cart: cartItems, totalAmount, cartCount });
});

// Thêm sản phẩm vào giỏ hàng
router.post('/add', (req, res) => {
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity, 10) || 1;

    const cart = req.session.cart || [];
    const existingProduct = cart.find(item => item.productId === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }
    req.session.cart = cart;

    res.redirect('/cart');
});

// Xóa sản phẩm khỏi giỏ hàng
router.post('/remove', (req, res) => {
    const productId = req.body.productId;
    const cart = req.session.cart || [];
    const existingProduct = cart.find(item => item.productId === productId);

    if (existingProduct) {
        if (existingProduct.quantity > 1) {
            existingProduct.quantity -= 1;
        } else {
            req.session.cart = cart.filter(item => item.productId !== productId);
        }
    }

    res.redirect('/cart');
});

module.exports = router;
