const Cart = require('../models/Cart')
const Product = require('../models/Product')

/**
 * GET /api/cart
 * Get user's shopping cart
 */
const getCart = async (req, res) => {
    try {
        const userId = req.user._id
        const userCart = await Cart.findOne({ user: userId }).populate('items.product')
        if (!userCart) {
            return res.json({
                success: true,
                cart: {
                    items: [],
                    aiSuggestions: { recipes: [] }
                },
                itemCount: 0,
                summary: { subtotal: '0.00', tax: '0.00', total: '0.00', itemCount: 0 }
            })
        } else {
            res.json({
                success: true,
                cart: userCart,
                itemCount: userCart.items.length,
                summary: userCart.getCartSummary()
            })
        }
    } catch (error) {
        console.error('Get Cart Error:', error)
        res.status(500).json({
            error: 'Failed to get cart',
            details: error.message
        })
    }
}

/**
 * POST /api/cart/add
 * Add item to cart
 * Body: { productId, quantity }
 */

const addToCart = async (req, res) => {
    try {
        const userId = req.user._id
        const { productId, quantity } = req.body

        // 1. Validate input
        if (!productId || !quantity) {
            return res.status(400).json({
                error: 'Product Id and quantity is required'
            })
        }
        if (quantity < 1) {
            return res.status(400).json({
                error: 'Quantity must be at least 1'
            })
        }
        // 2. Check if product exists (ONLY pass productId!)
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(400).json({
                error: 'Product not found'
            })
        }
        // 3. Check if enough stock available
        if (product.stock < quantity) {
            return res.status(400).json({
                error: `Only ${product.stock} items available in stock`
            })
        }
        // 4. Find or create user's cart
        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            //create new cart if customer doesn't have one
            cart = new Cart({
                user: userId,
                items: []
            })
        }
        // 5. Check if product already in cart
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId)
        if (existingItemIndex > -1) {
            // Product already in cart - update quantity
            const newQuantity = cart.items[existingItemIndex].quantity + quantity
            // Check total quantity doesn't exceed stock
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    error: `Cannot add ${quantity} more. Only ${product.stock - cart.items[existingItemIndex].quantity} items available`
                })
            }
            cart.items[existingItemIndex].quantity = newQuantity
        } else {
            // Product not in cart - add new item
            cart.items.push({
                product: productId,
                quantity: quantity,
                price: product.price,
                name: product.name
            })
        }
        // 6. Save cart and populate product details
        await cart.save()
        await cart.populate('items.product')
        // 7. Return updated cart
        res.json({
            success: true,
            message: 'Item added to cart',
            cart: cart,
            itemCount: cart.items.length,
            summary: cart.getCartSummary()
        })

    } catch (error) {
        console.error('Add to Cart Error:', error)
        res.status(500).json({
            error: 'Failed to add items to cart',
            details: error.message
        })
    }
}

/**
 * PUT /api/cart/update
 * Update item quantity in cart
 * Body: { productId, quantity }
 */
const updateCart = async (req, res) => {
    try {
        const userId = req.user._id
        const { productId, quantity } = req.body

        // Validation
        if (!productId || quantity === undefined) {
            return res.status(400).json({ error: 'Product ID and quantity are required' })
        }

        if (quantity < 0) {
            return res.status(400).json({ error: 'Quantity cannot be negative' })
        }

        // Find user's cart
        const cart = await Cart.findOne({ user: userId })

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' })
        }

        // Find the item in cart
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        )

        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Product not in cart' })
        }

        // If quantity is 0, remove the item
        if (quantity === 0) {
            cart.items.splice(itemIndex, 1)
        } else {
            // Check product stock
            const product = await Product.findById(productId)
            if (!product) {
                return res.status(404).json({ error: 'Product not found' })
            }

            if (quantity > product.stock) {
                return res.status(400).json({
                    error: `Only ${product.stock} items available in stock`
                })
            }

            // Update quantity
            cart.items[itemIndex].quantity = quantity
        }

        // Save and return updated cart
        await cart.save()
        await cart.populate('items.product')

        res.json({
            success: true,
            message: 'Cart updated',
            cart: cart,
            itemCount: cart.items.length,
            summary: cart.getCartSummary()
        })

    } catch (error) {
        console.error('Update Cart Error:', error)
        res.status(500).json({
            error: 'Failed to update cart',
            details: error.message
        })
    }
}

/**
 * DELETE /api/cart/remove/:productId
 * Remove item from cart
 */
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id
        const { productId } = req.params

        // Find user's cart
        const cart = await Cart.findOne({ user: userId })

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' })
        }

        // Remove item from cart
        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        )

        await cart.save()
        await cart.populate('items.product')

        res.json({
            success: true,
            message: 'Item removed from cart',
            cart: cart,
            itemCount: cart.items.length,
            summary: cart.getCartSummary()
        })

    } catch (error) {
        console.error('Remove from Cart Error:', error)
        res.status(500).json({
            error: 'Failed to remove item from cart',
            details: error.message
        })
    }
}

/**
 * DELETE /api/cart/clear
 * Clear entire cart
 */
const clearCart = async (req, res) => {
    try {
        const userId = req.user._id

        const cart = await Cart.findOne({ user: userId })

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' })
        }

        cart.items = []
        cart.aiSuggestions = { recipes: [] }

        await cart.save()

        res.json({
            success: true,
            message: 'Cart cleared',
            cart: cart,
            itemCount: 0,
            summary: cart.getCartSummary()
        })

    } catch (error) {
        console.error('Clear Cart Error:', error)
        res.status(500).json({
            error: 'Failed to clear cart',
            details: error.message
        })
    }
}

module.exports = {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart
}