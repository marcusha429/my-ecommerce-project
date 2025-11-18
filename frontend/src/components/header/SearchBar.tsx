'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { API_URL } from '@/lib/api'

interface SearchBarProps {
    onSearch: (query: string) => void
    placeholder?: string
}

interface Product {
    _id: string
    name: string
    price: number
    images: string[]
    category: string
}

export default function SearchBar({ onSearch, placeholder = 'Search products...' }: SearchBarProps) {
    // 4. State - add useState here
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)
    const [suggestions, setSuggestions] = useState<Product[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSuggestions([])
            return
        }
        setIsLoading(true)
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}/api/products/search?q=${encodeURIComponent(searchQuery.trim())}`)
                const data = await response.json()
                setSuggestions(data)
                setShowSuggestions(true)
            } catch (error) {
                console.error('Search error:', error)
                setSuggestions([])
            } finally {
                setIsLoading(false)
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])
    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
                if (searchQuery.trim() === '') {
                    setIsExpanded(false)
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [searchQuery])
    // 5. Functions - we'll add later
    const handleExpand = () => {
        setIsExpanded(true)
    }

    const handleCollapse = () => {
        if (searchQuery.trim() === '') {
            setIsExpanded(false)
            setShowSuggestions(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(searchQuery)
        setShowSuggestions(false)
        setIsExpanded(false)
    }

    const handleProductClick = (productId: string) => {
        router.push(`/product/${productId}`)
        setSearchQuery('')
        setShowSuggestions(false)
        setIsExpanded(false)
    }
    // 6. Return JSX - we'll add later
    return (
        <div className='relative' ref={searchRef}>
            {isExpanded ? (
                // EXPANDED: Show search form
                <form onSubmit={handleSubmit} className='flex items-center'>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={placeholder}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        onBlur={handleCollapse}
                        autoFocus
                        className='w-64 px-4 py-2 pl-10 border border-gray-300 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                    />
                    {/* Icon inside input */}
                    <HiMagnifyingGlass className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none' />
                    {/* Dropdown Suggestions */}
                    {showSuggestions && (searchQuery.trim() !== '') && (
                        <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50'>
                            {isLoading ? (
                                <div className='p-4 text-center text-gray-500'>
                                    Searching...
                                </div>
                            ) : suggestions.length > 0 ? (
                                <div className='py-2'>
                                    {suggestions.map((product) => (
                                        <button
                                            key={product._id}
                                            type='button'
                                            onClick={() => handleProductClick(product._id)}
                                            className='w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors text-left'
                                        >
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className='w-12 h-12 object-cover rounded'
                                            />
                                            <div className='flex-1'>
                                                <p className='text-sm font-medium text-gray-900'>{product.name}</p>
                                                <p className='text-xs text-gray-500'>{product.category}</p>
                                            </div>
                                            <p className='text-sm font-semibold text-emerald-600'>
                                                ${product.price.toFixed(2)}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className='p-4 text-center text-gray-500'>
                                    No products found for "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </form>
            ) : (
                // COLLAPSED: Show only magnifier button
                <button
                    onClick={handleExpand}
                    className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                >
                    <HiMagnifyingGlass className='w-6 h-6 text-gray-700' />
                </button>
            )}
        </div>
    )
}


