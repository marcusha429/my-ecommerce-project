const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors({ origin: '*' }))
app.use(express.json())

// MongoDB connection
let isConnected = false

const connectDB = async () => {
    if (isConnected) return

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        })
        isConnected = true
        console.log('✓ MongoDB connected')
    } catch (error) {
        console.error('✗ MongoDB error:', error.message)
    }
}

connectDB()

// Routes
app.get('/', (req, res) => {
    res.send('API is running...')
})

app.get('/api/products', async (req, res) => {
    try {
        const Product = require('./models/Product')
        const products = await Product.find()
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Export for Vercel
module.exports = app
