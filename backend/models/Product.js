const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true
        },
        description:{
            type: String,
            required: true,
        },
        price:{
            type: Number,
            required: true,
            min: 0
        },
        images:[{
            type: String,
            required: true
        }],
        category:{
            type: String,
            required: true,
            enum: ['new-arrivals, trending, electronics, accessories']
        },
        featured:{
            type: Boolean,
            default: false
        },    name: {
        type: String,
        required: true,
        trim: true
        },
        trending:{
            type: Boolean,
            default: false
        },
        stock:{
            type: Number,
            default: 0,
            min: 0
        },
        brand: String, specifications:{
            color: String,
            storage: String
        }
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model('Product' , productSchema)