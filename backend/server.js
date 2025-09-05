const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use (cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MONGODB'))
    .catch((err => console.log(err)))

app.get('/', (req,res) => {
    res.send('API is running...')
})

app.listen(PORT, () => {
    console.log('Server is running on PORT ${PORT}...')
})

