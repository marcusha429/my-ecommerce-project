const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
// const helmet = require('helmet') // Disabled for Vercel serverless
require('dotenv').config()

const app = express()
//security middleware
// app.use(helmet()) // Disabled for Vercel serverless

app.use(cors({
    origin: [
        'https://groceryhub-frontend.vercel.app',
        'https://groceryhub-frontend-djmyc68xs-marcus-has-projects.vercel.app',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}))
app.use(express.json())

//cookie-parser middleware
const cookieParser = require('cookie-parser')
app.use(cookieParser())

/*
+-----------------------------------------+
+                 routes                  +
+-----------------------------------------+
*/

/* Auth Route */
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

/* Product Route */
const productRoutes = require('./routes/product')
app.use('/api/products', productRoutes)

/* Cart Route */
const cartRoutes = require('./routes/cart')
app.use('/api/cart', cartRoutes)

/* AI Route */
const aiRoutes = require('./routes/ai')
app.use('/api/ai', aiRoutes)

/* Upload Route */
const uploadRoutes = require('./routes/upload')
app.use('/api/upload', uploadRoutes)

//port
const PORT = process.env.PORT || 5000

// MongoDB connection with serverless optimization
let isConnected = false

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection')
        return
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        })
        isConnected = true
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        throw error
    }
}

// Connect immediately for serverless
connectDB().catch(err => console.error('Initial DB connection failed:', err))

app.get('/', (req, res) => {
    res.send('API is running...')
})

// For local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}...`)
    })
}

// Export for Vercel serverless
module.exports = app

