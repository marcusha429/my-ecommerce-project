const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0.1
    },
    unit: {
        type: String,
        default: 'lb'
    },
    image: String,
    organic: {
        type: Boolean,
        default: false
    }
})

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true // One cart per user
        },
        items: [cartItemSchema],
        // AI Recipe Suggestions Cache
        aiSuggestions: {
            recipes: [
                {
                    id: String,
                    title: String,
                    description: String,
                    imageUrl: String,
                    itemsInCart: [String],
                    missingItems: [
                        {
                            name: String,
                            quantity: Number,
                            unit: String,
                            price: Number,
                            productId: mongoose.Schema.Types.ObjectId
                        }
                    ],
                    instructions: [String],
                    cookTime: String,
                    servings: Number,
                    difficulty: {
                        type: String,
                        enum: ['Easy', 'Medium', 'Hard']
                    }
                }
            ],
            lastAnalyzed: Date,
            expiresAt: Date // Cache expires after 1 hour
        }
    },
    {
        timestamps: true
    }
)

// Method to check if AI suggestions are still valid
cartSchema.methods.hasValidSuggestions = function () {
    if (!this.aiSuggestions.expiresAt) return false
    return new Date() < this.aiSuggestions.expiresAt
}

// Method to calculate cart totals
cartSchema.methods.getCartSummary = function () {
    const subtotal = this.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + tax

    return {
        itemCount: this.items.length,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    }
}

module.exports = mongoose.model('Cart', cartSchema)
