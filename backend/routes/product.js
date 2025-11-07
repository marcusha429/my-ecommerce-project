const express = require('express')
const router = express.Router()
const adminAuth = require('../middleware/adminAuth')
const { getAllProducts, getProductById, getFeaturedProducts, getTrendingProducts, getProductsByCategory, createProduct, updateProduct, deleteProduct } = require('../controllers/product')
//get api
router.get('/', getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/trending', getTrendingProducts)
router.get('/category/:categoryName', getProductsByCategory)
router.get('/:id', getProductById)
//put, post, delete api (admin only)
router.put('/:id', adminAuth, updateProduct)
router.delete('/:id', adminAuth, deleteProduct)
router.post('/', adminAuth, createProduct)

module.exports = router