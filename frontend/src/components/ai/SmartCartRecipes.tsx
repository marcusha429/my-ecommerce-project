'use client'

import { useState, useEffect } from 'react'

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

//Mock data
const mockRecipes: Recipe[] = [
    {
        id: '1',
        title: 'Spinach & Egg Breakfast Bowl',
        description: 'Protein-packed healthy breakfast ready in 15 minutes',
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
        itemsInCart: ['Eggs', 'Baby Spinach', 'Milk'],
        missingItems: [], // Complete - has everything!
        instructions: [
            'Heat a pan with olive oil over medium heat',
            'Add spinach and sauté until wilted (2 mins)',
            'Whisk eggs with milk, salt, and pepper',
            'Pour eggs into pan and scramble gently',
            'Serve hot with toast'
        ],
        cookTime: '15 min',
        servings: 2,
        difficulty: 'Easy'
    },
    {
        id: '2',
        title: 'Creamy Chicken Spinach Skillet',
        description: 'One-pan dinner with tender chicken in creamy sauce',
        imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
        itemsInCart: ['Chicken Breast', 'Baby Spinach', 'Milk'],
        missingItems: [
            { ingredient: 'Garlic', suggestedProduct: 'Fresh Garlic Bulb', quantity: '3 cloves', price: 1.99 },
            { ingredient: 'Parmesan', suggestedProduct: 'Grated Parmesan Cheese', quantity: '1/2 cup', price: 4.99 },
        ],
        instructions: [
            'Season chicken with salt and pepper, sear until golden',
            'Remove chicken, sauté minced garlic in same pan',
            'Add spinach and milk, simmer 3 minutes',
            'Stir in parmesan until melted and creamy',
            'Return chicken to pan, coat with sauce',
            'Serve over rice or pasta'
        ],
        cookTime: '25 min',
        servings: 4,
        difficulty: 'Easy'
    },
    {
        id: '3',
        title: 'Mediterranean Chicken Salad',
        description: 'Fresh and healthy grilled chicken salad',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        itemsInCart: ['Chicken Breast', 'Baby Spinach'],
        missingItems: [
            { ingredient: 'Cherry Tomatoes', suggestedProduct: 'Organic Cherry Tomatoes', quantity: '1 cup', price: 3.49 },
            { ingredient: 'Cucumber', suggestedProduct: 'Fresh Cucumber', quantity: '1 piece', price: 1.99 },
            { ingredient: 'Feta Cheese', suggestedProduct: 'Crumbled Feta', quantity: '1/2 cup', price: 4.49 },
        ],
        instructions: [
            'Grill or pan-sear chicken until cooked through',
            'Chop tomatoes, cucumber, and spinach',
            'Slice cooked chicken into strips',
            'Toss vegetables with olive oil and lemon',
            'Top with chicken and crumbled feta',
            'Season with oregano and black pepper'
        ],
        cookTime: '20 min',
        servings: 3,
        difficulty: 'Easy'
    }
]

export default function SmartCartRecipes() {
    const [loading, setLoading] = useState(false)
    const [readyRecipes, setReadyRecipes] = useState<Recipe[]>([])
    const [almostReadyRecipes, setAlmostReadyRecipes] = useState<Recipe[]>([])
    const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null)

    useEffect(() => {
        //Auto analyze
        analyzeCartRecipes()
    }, [])

    const analyzeCartRecipes = () => {
        setLoading(true)
        //AI analyze
        setTimeout(() => {
            //categorize recipe
            const ready = mockRecipes.filter(r => r.missingItems.length === 0)
            const almost = mockRecipes.filter(r => r.missingItems.length > 0 && r.missingItems.length < 3)

            setReadyRecipes(ready)
            setAlmostReadyRecipes(almost)
            setLoading(false)
        }, 1500)
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
                        onClick={() => {
                            const recipeName = prompt('📝 What recipe are you planning to make?\n\nEnter the recipe name and AI will check if you have all ingredients:')
                            if (recipeName) {
                                alert(`🤖 AI is checking your cart for "${recipeName}"...\n\n(This will be connected to real AI in next steps)`)
                            }
                        }}
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
                                <div className="flex gap-4 p-4 bg-green-50">
                                    {/* Recipe Image */}
                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.title}
                                        className="w-24 h-24 rounded-lg object-cover"
                                    />

                                    {/* Recipe Info */}
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-800 mb-1">{recipe.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                                        <div className="flex gap-4 text-xs text-gray-500">
                                            <span>⏱️ {recipe.cookTime}</span>
                                            <span>👥 {recipe.servings} servings</span>
                                            <span>📊 {recipe.difficulty}</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => toggleRecipeDetails(recipe.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg whitespace-nowrap"
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
                                <div className="flex gap-4 p-4 bg-orange-50">
                                    {/* Recipe Image */}
                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.title}
                                        className="w-24 h-24 rounded-lg object-cover"
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
                                            <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-800">{item.ingredient}</div>
                                                    <div className="text-sm text-gray-600">{item.suggestedProduct} • {item.quantity}</div>
                                                </div>
                                                <div className="text-lg font-bold text-emerald-600">${item.price}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => addMissingItemsToCart(recipe)}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <span>➕</span>
                                            Add Items & Show Recipe
                                        </button>
                                        {expandedRecipe !== recipe.id && (
                                            <button
                                                onClick={() => toggleRecipeDetails(recipe.id)}
                                                className="px-6 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 py-3 rounded-lg font-semibold transition-all"
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
        </div>
    )
}