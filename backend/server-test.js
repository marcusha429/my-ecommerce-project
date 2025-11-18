const express = require('express')
const app = express()

// Simple test route
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API is running',
        timestamp: new Date().toISOString(),
        env: {
            hasMongoUri: !!process.env.MONGO_URI,
            hasJwtSecret: !!process.env.JWT_ACCESS_SECRET,
            nodeEnv: process.env.NODE_ENV
        }
    })
})

app.get('/test-db', async (req, res) => {
    try {
        const mongoose = require('mongoose')
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        })
        res.json({ status: 'OK', message: 'MongoDB connected successfully' })
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: error.message,
            code: error.code
        })
    }
})

module.exports = app
