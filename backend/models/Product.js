const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        images: [{
            type: String,
            required: true
        }],
        category: {
            type: String,
            required: true,
            enum: ['fruits-vegetables', 'dairy-eggs', 'meat-seafood', 'bakery', 'beverages', 'snacks', 'pantry']
        },
        toppick: {
            type: Boolean,
            default: false
        },
        popular: {
            type: Boolean,
            default: false
        },
        stock: {
            type: Number,
            default: 0,
            min: 0
        },
        brand: String,
        unit: {
            type: String,
            enum: ['lb', 'kg', 'oz', 'piece', 'dozen', 'gallon', 'liter'],
            default: 'piece'
        },
        weight: Number,
        expirationDate: Date,
        organic: { type: Boolean, default: false },
        nutrition: {
            calories: Number,
            protein: Number,
            carbs: Number,
            fat: Number,
            fiber: Number
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Product', productSchema)