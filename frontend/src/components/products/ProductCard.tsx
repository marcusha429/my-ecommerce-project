'use client'

import { Product } from '@/types/product'
import { gradients, primaryBtn, secondaryBtn } from '@/constants/style'
import * as cartService from '@/services/cartService'
import { useState } from 'react'

interface ProductCardProps {
    product: Product
    variant?: 'toppick' | 'popular'
    index?: number
}

export default function ProductCard({
    product,
    variant = 'popular',
    index = 0
}: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false)

    const handleAddToCart = async () => {
        try {
            setIsAdding(true)
            await cartService.addToCart(product._id, 1)

            // Refresh cart count in header
            if (typeof window !== 'undefined' && (window as any).refreshCartCount) {
                await (window as any).refreshCartCount()
            }

            alert(`${product.name} added to cart!`)
        } catch (error: any) {
            alert(error.message || 'Failed to add to cart. Please login first.')
        } finally {
            setIsAdding(false)
        }
    }

    if (variant === 'toppick') {
        return (
            <div className={`bg-gradient-to-r ${gradients[index % gradients.length]} rounded-3xl p-8 md:p-12 mb-6 overflow-hidden relative`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    <div className="md:w-1/2 mb-6 md:mb-0">
                        {/* Organic Badge */}
                        {product.organic && (
                            <span className="inline-block bg-gray-800 text-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                🌱 Organic
                            </span>
                        )}
                        <h3 className="text-4xl md:text-6xl font-bold mb-4">{product.name}</h3>
                        <p className="text-xl mb-6 opacity-90">{product.description}</p>

                        {/* Price with Unit */}
                        <div className="flex items-baseline gap-2 mb-6">
                            <p className="text-3xl md:text-4xl font-bold">${product.price}</p>
                            {product.unit && <span className="text-lg opacity-80">/ {product.unit}</span>}
                        </div>

                        {/* Stock Indicator */}
                        {product.stock !== undefined && (
                            <p className="text-sm mb-6 opacity-90">
                                {product.stock > 10 ? '✓ In Stock' : product.stock > 0 ? '⚠ Low Stock' : '✗ Out of Stock'}
                            </p>
                        )}

                        <div className="flex gap-4 flex-wrap">
                            <button className={`${primaryBtn[index % primaryBtn.length]} px-8 py-3 rounded-full font-semibold transition-colors`}>
                                View Details
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding || product.stock === 0}
                                className={`${secondaryBtn[index % secondaryBtn.length]} px-8 py-3 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isAdding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>

                    {/* Product Image */}
                    <div className="md:w-1/2 flex justify-center">
                        <div className="w-80 h-80 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
                            {product.images && product.images[0] ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="opacity-60 text-center">No Image Available</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Popular variant
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200">
            <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                {/* Product Image */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-50 rounded-2xl overflow-hidden">
                        {product.images && product.images[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-400 text-sm">No Image</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2">
                    {/* Organic Badge */}
                    {product.organic && (
                        <span className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                            🌱 Organic
                        </span>
                    )}

                    <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900">{product.name}</h3>
                    <p className="text-sm md:text-base text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                    {/* Price with Unit */}
                    <div className="flex items-baseline gap-2 mb-3">
                        <p className="text-2xl md:text-3xl font-bold text-emerald-600">${product.price}</p>
                        {product.unit && <span className="text-sm text-gray-500">/ {product.unit}</span>}
                    </div>

                    {/* Stock Indicator */}
                    {product.stock !== undefined && (
                        <p className="text-sm text-gray-600 mb-4">
                            {product.stock > 10 ? (
                                <span className="text-emerald-600">✓ In Stock</span>
                            ) : product.stock > 0 ? (
                                <span className="text-orange-600">⚠ Only {product.stock} left</span>
                            ) : (
                                <span className="text-red-600">✗ Out of Stock</span>
                            )}
                        </p>
                    )}

                    <div className="flex gap-3 flex-wrap">
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-semibold transition-colors text-sm md:text-base">
                            View Details
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || product.stock === 0}
                            className="bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50 px-6 py-2 rounded-full font-semibold transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAdding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
