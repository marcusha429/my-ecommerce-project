/**
 * Clear AI suggestions cache from all carts
 * This script clears old cached AI suggestions that may have incorrect schema
 */

const mongoose = require('mongoose')
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })

const MONGO_URI = process.env.MONGO_URI

async function clearCartCache() {
    try {
        console.log('Connecting to MongoDB...')
        await mongoose.connect(MONGO_URI)
        console.log('Connected!')

        const Cart = mongoose.model('Cart', new mongoose.Schema({}, { strict: false }))

        // Clear all aiSuggestions from carts
        const result = await Cart.updateMany(
            {},
            {
                $unset: { aiSuggestions: "" }
            }
        )

        console.log(`✅ Cleared AI suggestions from ${result.modifiedCount} carts`)

        await mongoose.disconnect()
        console.log('Done!')
    } catch (error) {
        console.error('Error:', error)
        process.exit(1)
    }
}

clearCartCache()
