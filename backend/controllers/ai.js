const User = require('../models/User')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const {
    getGroceryRecommendation,
    analyzeCartForRecipes,
    checkCustomRecipe
} = require('../utils/geminiAI')

/**
 * POST /api/ai/chat
 * Chat with Gemini AI about groceries, meals, health
 */
exports.chat = async (req, res) => {
    try {
        const { message } = req.body
        const userId = req.user._id // From auth middleware

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message is required' })
        }

        // Get user's health profile
        const user = await User.findById(userId).select('healthProfile chatHistory')

        // Get AI response
        const aiResponse = await getGroceryRecommendation(message, user.healthProfile)

        // Save chat history to user document
        user.chatHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: aiResponse }
        )

        // Keep only last 50 messages (25 pairs) to avoid document size issues
        if (user.chatHistory.length > 50) {
            user.chatHistory = user.chatHistory.slice(-50)
        }

        await user.save()

        res.json({
            success: true,
            message: aiResponse,
            timestamp: new Date()
        })
    } catch (error) {
        console.error('AI Chat Error:', error)
        res.status(500).json({
            error: 'Failed to process chat message',
            details: error.message
        })
    }
}

/**
 * POST /api/ai/analyze-cart
 * Analyze shopping cart and suggest recipes
 */
exports.analyzeCart = async (req, res) => {
    try {
        const userId = req.user._id

        // Get user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.product')

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' })
        }

        // Check if we have valid cached suggestions
        if (cart.hasValidSuggestions()) {
            return res.json({
                success: true,
                recipes: cart.aiSuggestions.recipes,
                cached: true,
                analyzedAt: cart.aiSuggestions.lastAnalyzed
            })
        }

        // Get all available products (for finding missing items)
        const allProducts = await Product.find().select('name price unit')

        // Analyze cart with Gemini AI
        const recipes = await analyzeCartForRecipes(cart.items, allProducts)

        // Enhance recipes with actual product IDs for missing items
        const enhancedRecipes = recipes.map(recipe => {
            const missingItemsWithIds = recipe.missingItems.map(item => {
                // Find matching product in database
                const product = allProducts.find(
                    p => p.name.toLowerCase().includes(item.name.toLowerCase())
                )
                return {
                    ...item,
                    productId: product ? product._id : null,
                    price: product ? product.price : item.estimatedPrice
                }
            })

            return {
                ...recipe,
                id: Math.random().toString(36).substr(2, 9), // Generate unique ID
                imageUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=400`, // Placeholder
                missingItems: missingItemsWithIds
            }
        })

        // Cache suggestions in cart (expires in 1 hour)
        cart.aiSuggestions = {
            recipes: enhancedRecipes,
            lastAnalyzed: new Date(),
            expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        }

        await cart.save()

        res.json({
            success: true,
            recipes: enhancedRecipes,
            cached: false,
            analyzedAt: new Date()
        })
    } catch (error) {
        console.error('Cart Analysis Error:', error)
        res.status(500).json({
            error: 'Failed to analyze cart',
            details: error.message
        })
    }
}

/**
 * POST /api/ai/check-recipe
 * Check if user can make a custom recipe with their cart items
 */
exports.checkRecipe = async (req, res) => {
    try {
        const { recipeName, cartItems } = req.body
        const userId = req.user._id

        if (!recipeName || recipeName.trim() === '') {
            return res.status(400).json({ error: 'Recipe name is required' })
        }

        // Use provided cartItems or fetch from database
        let items = cartItems

        if (!items || items.length === 0) {
            // Try to get from database
            const cart = await Cart.findOne({ user: userId }).populate('items.product')
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ error: 'Cart is empty' })
            }
            items = cart.items
        }

        // Get all available products first
        const allProducts = await Product.find().select('name price unit')

        // Check custom recipe with Gemini AI (pass available products)
        const analysis = await checkCustomRecipe(recipeName, items, allProducts)

        if (analysis.missingItems) {
            analysis.missingItems = analysis.missingItems.map(item => {
                const product = allProducts.find(
                    p => p.name.toLowerCase().includes(item.name.toLowerCase())
                )
                return {
                    ...item,
                    productId: product ? product._id : null,
                    price: product ? product.price : item.estimatedPrice
                }
            })
        }

        res.json({
            success: true,
            analysis: analysis
        })
    } catch (error) {
        console.error('Recipe Check Error:', error)
        res.status(500).json({
            error: 'Failed to check recipe',
            details: error.message
        })
    }
}
