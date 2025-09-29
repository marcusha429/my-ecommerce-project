const express = require('express')
const router = express.Router()
const { getAllProducts, getFeaturedProducts, getTrendingProducts, getProductsByCategory, createProduct } = require('../controllers/product')

//get api
router.get('/', getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/trending', getTrendingProducts)
router.get('/category/:categoryName', getProductsByCategory)

//post api
router.post('/', createProduct)

module.exports = router