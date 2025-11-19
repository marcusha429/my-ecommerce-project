const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

const app = express()

//CORS must be before helmet for proper header ordering
app.use(cors({
    origin: [
        'https://groceryhub.vercel.app',
        'https://frontend-alpha-three-97.vercel.app', // Keep old domain during transition
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}))

//Security middleware - helmet works fine in serverless
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for now to avoid blocking resources
    crossOriginEmbedderPolicy: false
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

