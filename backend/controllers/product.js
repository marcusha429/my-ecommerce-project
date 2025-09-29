const Product = require('../models/Product')

// Get all products
const getAllProducts = async (req, res) => {
    try {
        //get all products from db and response as json
        const products = await Product.find()
        res.json(products)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getFeaturedProducts = async (req, res) => {
    try {
        //get products which is featured
        const products = await Product.find({ featured: true })
        res.json(products)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getTrendingProducts = async (req, res) => {
    try {
        //get products which is trending
        const products = await Product.find({ trending: true })
        res.json(products)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getProductsByCategory = async (req, res) => {
    const categoryName = req.params.categoryName
    try {
        const products = await Product.find({ category: categoryName })
        res.json(products)
    } catch (error) {
        res.status(500).json({ // 500 means server error
            error: error.message
        })
    }
}

const createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body)
        res.status(201).json(newProduct) //201 means created, 200 means ok
    } catch (error) {
        res.status(400).json({ //400 means bad request
            error: error.message
        })
    }
}

module.exports = {
    getAllProducts,
    getFeaturedProducts,
    getTrendingProducts,
    getProductsByCategory,
    createProduct
}