'use client'

import { useState, useEffect } from 'react'
import { API_URL } from '@/lib/api'
import RecipeCheckModal from './RecipeCheckModal'

interface MissingItem {
    ingredient: string
    suggestedProduct: string
    quantity: string
    price: number
    productId?: string
}

interface Recipe {
    id: string
    title: string
    description: string
    imageUrl: string
    itemsInCart: string[]
    missingItems: MissingItem[]
    instructions: string[]
    cookTime: string
    servings: number
    difficulty: 'Easy' | 'Meduim' | 'Hard'
}

// No more mock data - always use real AI suggestions from backend

interface SmartCartRecipesProps {
    cartItems: any[]
}

export default function SmartCartRecipes({ cartItems }: SmartCartRecipesProps) {
    const [loading, setLoading] = useState(false)
    const [readyRecipes, setReadyRecipes] = useState<Recipe[]>([])
    const [almostReadyRecipes, setAlmostReadyRecipes] = useState<Recipe[]>([])
    const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null)
    const [showRecipeModal, setShowRecipeModal] = useState(false)

    useEffect(() => {
        //Auto analyze
        analyzeCartRecipes()
    }, [])

    const analyzeCartRecipes = async () => {
        setLoading(true)

        try {
            const token = localStorage.getItem('accessToken')

            if (!token) {
                // User must be logged in to use AI features
                setLoading(false)
                return
            }

            // Call backend API
            const response = await fetch(`${API_URL}/api/ai/analyze-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze cart')
            }

            // Categorize recipes from API response
            const ready = data.recipes.filter((r: Recipe) => r.missingItems.length === 0)
            const almost = data.recipes.filter((r: Recipe) => r.missingItems.length > 0 && r.missingItems.length <= 3)

            setReadyRecipes(ready)
            setAlmostReadyRecipes(almost)
        } catch (error: any) {
            console.error('Cart Analysis Error:', error)
            // Don't fall back to mock data - show empty state
            setReadyRecipes([])
            setAlmostReadyRecipes([])
        } finally {
            setLoading(false)
        }
    }

    const addMissingItemsToCart = (recipe: Recipe) => {
        const totalPrice = recipe.missingItems.reduce((sum, item) => sum + item.price, 0)
        const itemsList = recipe.missingItems.map(item => `• ${item.suggestedProduct} - $${item.price}`).join('\n')

        const confirmed = confirm(
            `Add missing items for "${recipe.title}"?\n\n${itemsList}\n\nTotal: $${totalPrice.toFixed(2)}`
        )

        if (confirmed) {
            alert(`✅ ${recipe.missingItems.length} items added to cart!\n\nNow you can make ${recipe.title}! 🍳`)
            // After adding, move to ready recipes
            setAlmostReadyRecipes(prev => prev.filter(r => r.id !== recipe.id))
            setReadyRecipes(prev => [...prev, { ...recipe, missingItems: [] }])
        }
    }

    const toggleRecipeDetails = (recipeId: string) => {
        setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId)
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-lg p-8 border border-emerald-100">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-lg text-gray-600">🤖 AI is analyzing your cart...</span>
                </div>
            </div>
        )
    }
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                            <span className="text-4xl">🍳</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Smart Recipe Suggestions</h2>
                            <p className="text-emerald-100">AI-powered meal ideas based on your cart</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowRecipeModal(true)}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold transition-all border-2 border-white/40 whitespace-nowrap"
                    >
                        📝 Got Your Own Recipe?
                    </button>
                </div>
            </div>

            {/* Ready to Cook Recipes */}
            {readyRecipes.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>✅</span> Ready to Cook ({readyRecipes.length})
                        </h3>
                        <p className="text-green-100 text-sm">You have all ingredients for these recipes!</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {readyRecipes.map((recipe) => (
                            <div key={recipe.id} className="border border-green-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-green-50">
                                    {/* Recipe Image */}
                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.title}
                                        className="w-full sm:w-24 h-48 sm:h-24 rounded-lg object-cover"
                                    />

                                    {/* Recipe Info */}
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-800 mb-1">{recipe.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-gray-500">
                                            <span>⏱️ {recipe.cookTime}</span>
                                            <span>👥 {recipe.servings} servings</span>
                                            <span>📊 {recipe.difficulty}</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => toggleRecipeDetails(recipe.id)}
                                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                                        >
                                            {expandedRecipe === recipe.id ? 'Hide Recipe' : 'Show Recipe'}
                                        </button>
                                    </div>
                                </div>

                                {/* Recipe Details - Expandable */}
                                {expandedRecipe === recipe.id && (
                                    <div className="p-6 bg-white border-t border-green-200">
                                        <div className="mb-4">
                                            <h5 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                ✓ Ingredients You Have:
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {recipe.itemsInCart.map((item, idx) => (
                                                    <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="font-bold text-gray-700 mb-3">📝 Instructions:</h5>
                                            <ol className="space-y-2">
                                                {recipe.instructions.map((step, idx) => (
                                                    <li key={idx} className="flex gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="text-gray-700">{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Almost Ready Recipes */}
            {almostReadyRecipes.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-orange-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>⚡</span> Almost Ready ({almostReadyRecipes.length})
                        </h3>
                        <p className="text-orange-100 text-sm">Just a few items away from these recipes!</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {almostReadyRecipes.map((recipe) => (
                            <div key={recipe.id} className="border border-orange-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-orange-50">
                                    {/* Recipe Image */}
                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.title}
                                        className="w-full sm:w-24 h-48 sm:h-24 rounded-lg object-cover"
                                    />

                                    {/* Recipe Info */}
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-800 mb-1">{recipe.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                                        <p className="text-sm font-semibold text-orange-600">
                                            Need {recipe.missingItems.length} more {recipe.missingItems.length === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>
                                </div>

                                {/* Missing Items Section */}
                                <div className="p-4 bg-white border-t border-orange-200">
                                    <h5 className="font-semibold text-gray-700 mb-3">🛒 You need to buy:</h5>
                                    <div className="space-y-2 mb-4">
                                        {recipe.missingItems.map((item, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-orange-50 rounded-lg gap-2">
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-800">{item.ingredient}</div>
                                                    <div className="text-sm text-gray-600">{item.suggestedProduct} • {item.quantity}</div>
                                                </div>
                                                <div className="text-lg font-bold text-emerald-600">${item.price}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => addMissingItemsToCart(recipe)}
                                            className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <span>➕</span>
                                            <span className="hidden sm:inline">Add Items & Show Recipe</span>
                                            <span className="sm:hidden">Add Items</span>
                                        </button>
                                        {expandedRecipe !== recipe.id && (
                                            <button
                                                onClick={() => toggleRecipeDetails(recipe.id)}
                                                className="w-full sm:w-auto px-6 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 py-3 rounded-lg font-semibold transition-all"
                                            >
                                                Preview Recipe
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Recipe Preview - Expandable */}
                                {expandedRecipe === recipe.id && (
                                    <div className="p-6 bg-gray-50 border-t border-orange-200">
                                        <div className="mb-4">
                                            <h5 className="font-bold text-gray-700 mb-2">✓ You Already Have:</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {recipe.itemsInCart.map((item, idx) => (
                                                    <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="font-bold text-gray-700 mb-3">📝 Recipe Preview:</h5>
                                            <ol className="space-y-2">
                                                {recipe.instructions.map((step, idx) => (
                                                    <li key={idx} className="flex gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="text-gray-700">{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Recipes Found */}
            {readyRecipes.length === 0 && almostReadyRecipes.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No recipes found yet</h3>
                    <p className="text-gray-600">Add more items to your cart and AI will suggest recipes for you!</p>
                </div>
            )}

            {/* Recipe Check Modal */}
            <RecipeCheckModal
                isOpen={showRecipeModal}
                onClose={() => setShowRecipeModal(false)}
                cartItems={cartItems}
            />
        </div>
    )
}