const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Lấy danh sách sản phẩm
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.render('products', { products });
});

// Lấy thông tin chi tiết của một sản phẩm
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('product-details', { product });
});

// Tạo sản phẩm mới
router.post('/add', async (req, res) => {
    const { name, description, price } = req.body;
    const newProduct = new Product({ name, description, price });
    await newProduct.save();
    res.redirect('/products');
});

// Sửa thông tin sản phẩm
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa sản phẩm
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Deleted Product' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
