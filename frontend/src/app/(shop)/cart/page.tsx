'use client'

import { useState, useEffect } from 'react'
import SmartCartRecipes from '@/components/ai/SmartCartRecipes'
import * as cartService from '@/services/cartService'

interface CartItem {
    _id?: string
    product: {
        _id: string
        name: string
        price: number
        images: string[]
        category: string
    }
    quantity: number
    price: number
    name: string
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState({
        subtotal: '0.00',
        tax: '0.00',
        total: '0.00',
        itemCount: 0
    })

    // Load cart on mount
    useEffect(() => {
        loadCart()
    }, [])

    const loadCart = async () => {
        try {
            setLoading(true)
            const data = await cartService.getCart()
            setCartItems(data.cart.items || [])
            setSummary(data.summary || {
                subtotal: '0.00',
                tax: '0.00',
                total: '0.00',
                itemCount: 0
            })
        } catch (error) {
            console.error('Failed to load cart:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateQuantity = async (productId: string, newQuantity: number) => {
        try {
            const data = await cartService.updateCart(productId, newQuantity)
            setCartItems(data.cart.items || [])
            setSummary(data.summary)

            // Refresh cart count in header
            if (typeof window !== 'undefined' && (window as any).refreshCartCount) {
                await (window as any).refreshCartCount()
            }
        } catch (error: any) {
            alert(error.message || 'Failed to update cart')
        }
    }

    const removeItem = async (productId: string) => {
        const confirmed = confirm('Remove this item from cart?')
        if (confirmed) {
            try {
                const data = await cartService.removeFromCart(productId)
                setCartItems(data.cart.items || [])
                setSummary(data.summary)

                // Refresh cart count in header
                if (typeof window !== 'undefined' && (window as any).refreshCartCount) {
                    await (window as any).refreshCartCount()
                }
            } catch (error: any) {
                alert(error.message || 'Failed to remove item')
            }
        }
    }

    const subtotal = parseFloat(summary.subtotal)
    const tax = parseFloat(summary.tax)
    const total = parseFloat(summary.total)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl text-gray-600">Loading cart...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                <div className={`grid ${cartItems.length > 0 ? 'lg:grid-cols-3' : ''} gap-8`}>
                    {/* Left Column - Cart Items */}
                    <div className={cartItems.length > 0 ? 'lg:col-span-2 space-y-4' : 'space-y-4'}>
                        {cartItems.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto">
                                <div className="text-6xl mb-4">🛒</div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                                <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
                                <a
                                    href="/dashboard"
                                    className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
                                >
                                    Start Shopping
                                </a>
                            </div>
                        ) : (
                            <>
                                {cartItems.map((item) => (
                                    <div key={item.product._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4">
                                        <div className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="relative">
                                                <img
                                                    src={item.product.images?.[0] || '/placeholder.png'}
                                                    alt={item.product.name}
                                                    className="w-24 h-24 rounded-lg object-cover"
                                                />
                                                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                    🌱
                                                </span>
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                                                <p className="text-sm text-gray-500 mb-1">{item.product.category}</p>
                                                <p className="text-emerald-600 font-bold text-xl mb-2">
                                                    ${item.product.price.toFixed(2)}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-600">Quantity:</span>
                                                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                            className="px-3 py-1 hover:bg-gray-200 rounded-l-lg transition-colors font-bold text-gray-900"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="px-4 font-semibold text-gray-900">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                            className="px-3 py-1 hover:bg-gray-200 rounded-r-lg transition-colors font-bold text-gray-900"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Item Total & Remove */}
                                            <div className="flex flex-col items-end justify-between">
                                                <p className="text-xl font-bold text-gray-900">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </p>
                                                <button
                                                    onClick={() => removeItem(item.product._id)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    {cartItems.length > 0 && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax (8%)</span>
                                        <span className="font-semibold">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery</span>
                                        <span className="font-semibold text-emerald-600">FREE</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-lg font-bold text-lg transition-all shadow-md hover:shadow-lg mb-3">
                                    Proceed to Checkout
                                </button>

                                <button className="w-full bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3 rounded-lg font-semibold transition-all">
                                    Continue Shopping
                                </button>

                                {/* Promo Code */}
                                <div className="mt-6 pt-6 border-t">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Have a promo code?
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter code"
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-emerald-500"
                                        />
                                        <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold transition-all">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Recipe Suggestions - Only show if cart has items */}
                {cartItems.length > 0 && (
                    <div className="mt-12">
                        <SmartCartRecipes cartItems={cartItems} />
                    </div>
                )}
            </div>
        </div>
    )
}