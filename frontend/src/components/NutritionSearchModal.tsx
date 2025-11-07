'use client'

import { useState } from 'react'
import { searchFoods, extractNutrition, USDAFoodItem, NutritionData } from '@/lib/usda'

interface NutritionSearchModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (nutrition: NutritionData) => void
}

export default function NutritionSearchModal({ isOpen, onClose, onSelect }: NutritionSearchModalProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<USDAFoodItem[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async () => {
        if (!searchQuery.trim()) return
        setIsSearching(true)
        const result = await searchFoods(searchQuery)
        setSearchResults(result)
        setIsSearching(false)
    }

    const handleSelect = (foodItem: USDAFoodItem) => {
        const nutrition = extractNutrition(foodItem)
        onSelect(nutrition)
        onClose()

    }
    if (!isOpen) return null

    return (
        // Overlay
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={onClose}>

            {/* Modal Content */}
            <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className='p-6 border-b border-gray-200'>
                    <h2 className='text-2xl font-bold text-gray-800'>Search USDA Nutrition Database</h2>
                    <p className='text-sm text-gray-600 mt-1'>Find nutrition information for your product</p>
                </div>

                {/* Search Section */}
                <div className='p-6 border-b border-gray-200'>
                    <div className='flex gap-3'>
                        <input
                            type='text'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder='Search for a food (e.g., banana, chicken breast)...'
                            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700'
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className='bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400'
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className='p-6'>
                    {isSearching && (
                        <p className='text-center text-gray-600 py-8'>Searching USDA database...</p>
                    )}

                    {!isSearching && searchResults.length === 0 && searchQuery && (
                        <p className='text-center text-gray-600 py-8'>No results found. Try a different search term.</p>
                    )}

                    {!isSearching && searchResults.length > 0 && (
                        <div className='space-y-2'>
                            <p className='text-sm text-gray-600 mb-4'>Click a food to auto-fill nutrition data:</p>
                            {searchResults.map((food) => (
                                <div
                                    key={food.fdcId}
                                    onClick={() => handleSelect(food)}
                                    className='p-4 border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-500 cursor-pointer transition-colors'
                                >
                                    <h3 className='font-semibold text-gray-800'>{food.description}</h3>
                                    {food.brandOwner && (
                                        <p className='text-sm text-gray-600'>Brand: {food.brandOwner}</p>
                                    )}
                                    <p className='text-xs text-gray-500 mt-1'>Data Type: {food.dataType}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer - Close Button */}
                <div className='p-6 border-t border-gray-200 flex justify-end'>
                    <button
                        onClick={onClose}
                        className='bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors'
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}