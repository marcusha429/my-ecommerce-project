const express = require('express')
const router = express.Router()
const adminAuth = require('../middleware/adminAuth')
const { getAllProducts, getProductById, getToppickProducts, getPopularProducts, getProductsByCategory, createProduct, updateProduct, deleteProduct, searchProducts } = require('../controllers/product')
//get api
router.get('/', getAllProducts)
router.get('/search', searchProducts)
router.get('/toppick', getToppickProducts)
router.get('/popular', getPopularProducts)
router.get('/category/:categoryName', getProductsByCategory)
router.get('/:id', getProductById)
//put, post, delete api (admin only)
router.put('/:id', adminAuth, updateProduct)
router.delete('/:id', adminAuth, deleteProduct)
router.post('/', adminAuth, createProduct)

module.exports = router