const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

const app = express()
//security middleware
app.use(helmet())

app.use(cors({
    origin: 'http://localhost:3000',
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

//port
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MONGODB'))
    .catch((err => console.log(err)))

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}...`)
})

