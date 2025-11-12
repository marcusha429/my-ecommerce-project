'use client'

import { useState } from 'react'

interface RecipeCheckModalProps {
    isOpen: boolean
    onClose: () => void
    cartItems: any[]
}

export default function RecipeCheckModal({ isOpen, onClose, cartItems }: RecipeCheckModalProps) {
    const [recipeName, setRecipeName] = useState('')
    const [loading, setLoading] = useState(false)
    const [analysis, setAnalysis] = useState<any>(null)
    const [step, setStep] = useState<'input' | 'result'>('input')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!recipeName.trim()) return

        setLoading(true)
        setStep('result')

        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                alert('⚠️ Please sign in to use this feature')
                resetModal()
                return
            }

            const response = await fetch('http://localhost:5000/api/ai/check-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipeName,
                    cartItems: cartItems
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to check recipe')
            }

            setAnalysis(data.analysis)
        } catch (error: any) {
            alert(`❌ Error: ${error.message}`)
            resetModal()
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (analysis?.missingItems) {
            alert(`✅ ${analysis.missingItems.length} items added to cart!\n\nNow you can make ${recipeName}! 🍜`)
            // TODO: Actually add items to cart
            resetModal()
        }
    }

    const resetModal = () => {
        setRecipeName('')
        setAnalysis(null)
        setStep('input')
        onClose()
    }

    if (!isOpen) return null

    const totalPrice = analysis?.missingItems?.reduce((sum: number, item: any) =>
        sum + (item.price || item.estimatedPrice || 0), 0) || 0

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/10" onClick={resetModal}></div>

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl pointer-events-auto">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 p-6 rounded-t-2xl">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-white">📝 Got Your Own Recipe?</h2>
                                <p className="text-sm text-emerald-100">Check if you have the ingredients</p>
                            </div>
                            <button
                                onClick={resetModal}
                                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors w-10 h-10 flex items-center justify-center text-2xl"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {step === 'input' && (
                            <form onSubmit={handleSubmit}>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    What recipe do you want to make?
                                </label>
                                <input
                                    type="text"
                                    value={recipeName}
                                    onChange={(e) => setRecipeName(e.target.value)}
                                    placeholder="e.g., Pho, Spaghetti Carbonara, Pad Thai..."
                                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!recipeName.trim()}
                                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                                >
                                    🔍 Check Ingredients
                                </button>
                            </form>
                        )}

                        {step === 'result' && loading && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600">🤖 AI is analyzing your recipe...</p>
                            </div>
                        )}

                        {step === 'result' && !loading && analysis && (
                            <div>
                                {/* Recipe Header */}
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{recipeName}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-emerald-600 h-3 rounded-full transition-all"
                                                style={{ width: `${analysis.percentageComplete}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-semibold text-emerald-700">
                                            {analysis.percentageComplete}% Complete
                                        </span>
                                    </div>
                                </div>

                                {/* What You Have */}
                                {analysis.itemsTheyHave && analysis.itemsTheyHave.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <span className="text-green-600">✅</span> You Have:
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {analysis.itemsTheyHave.map((item: string, idx: number) => (
                                                <div key={idx} className="bg-green-50 border border-green-200 px-3 py-2 rounded-lg text-sm text-green-800">
                                                    • {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Missing Items */}
                                {analysis.missingItems && analysis.missingItems.length > 0 ? (
                                    <div className="mb-6">
                                        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <span className="text-red-600">❌</span> Missing Items:
                                        </h4>
                                        <div className="space-y-2 mb-4">
                                            {analysis.missingItems.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                                                    <span className="text-gray-800">{item.name}</span>
                                                    <span className="text-lg font-bold text-emerald-600">
                                                        ${(item.price || item.estimatedPrice || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total */}
                                        <div className="bg-gray-100 border-2 border-gray-300 px-4 py-3 rounded-lg flex items-center justify-between">
                                            <span className="font-bold text-gray-800">Total Cost:</span>
                                            <span className="text-2xl font-bold text-emerald-600">${totalPrice.toFixed(2)}</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 mt-6">
                                            <button
                                                onClick={handleAddToCart}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
                                            >
                                                ➕ Add to Cart (${totalPrice.toFixed(2)})
                                            </button>
                                            <button
                                                onClick={resetModal}
                                                className="px-6 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-4 rounded-lg font-semibold transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-6xl mb-4">🎉</div>
                                        <h3 className="text-2xl font-bold text-green-600 mb-2">You're all set!</h3>
                                        <p className="text-gray-600 mb-6">You have everything you need to make {recipeName}!</p>
                                        <button
                                            onClick={resetModal}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
                                        >
                                            Great!
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
