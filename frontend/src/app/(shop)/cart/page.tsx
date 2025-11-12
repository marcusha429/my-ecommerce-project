'use client'

import { useState } from 'react'
import SmartCartRecipes from '@/components/ai/SmartCartRecipes'

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    unit: string
    image: string
    organic: boolean
}

// Mock cart data for testing
const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Organic Chicken Breast',
        price: 8.99,
        quantity: 1,
        unit: 'lb',
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200',
        organic: true
    },
    {
        id: '2',
        name: 'Organic Baby Spinach',
        price: 3.99,
        quantity: 0.5,
        unit: 'lb',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200',
        organic: true
    },
    {
        id: '3',
        name: 'Organic Eggs',
        price: 6.99,
        quantity: 1,
        unit: 'dozen',
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200',
        organic: true
    },
    {
        id: '4',
        name: 'Organic Whole Milk',
        price: 5.99,
        quantity: 0.5,
        unit: 'gallon',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200',
        organic: true
    },
]

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems)

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(id)
            return
        }
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        )
    }
    const removeItem = (id: string) => {
        const confirmed = confirm('Remove this item from cart?')
        if (confirmed) {
            setCartItems(items => items.filter(item => item.id !== id))
        }
    }
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + tax

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
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
                                    <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4">
                                        <div className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="relative">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-24 h-24 rounded-lg object-cover"
                                                />
                                                {item.organic && (
                                                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                        🌱
                                                    </span>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                                                <p className="text-emerald-600 font-bold text-xl mb-2">
                                                    ${item.price} <span className="text-sm text-gray-500">/ {item.unit}</span>
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-600">Quantity:</span>
                                                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 0.5)}
                                                            className="px-3 py-1 hover:bg-gray-200 rounded-l-lg transition-colors font-bold"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="px-4 font-semibold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 0.5)}
                                                            className="px-3 py-1 hover:bg-gray-200 rounded-r-lg transition-colors font-bold"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{item.unit}</span>
                                                </div>
                                            </div>

                                            {/* Item Total & Remove */}
                                            <div className="flex flex-col items-end justify-between">
                                                <p className="text-xl font-bold text-gray-900">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <button
                                                    onClick={() => removeItem(item.id)}
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
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
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