'use client'

import { useState } from 'react'
import { categories } from '@/constants/mockData'

export default function Explore() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev)
    }

    const closeDropdown = () => {
        setIsOpen(false)
    }

    const handleNavigation = (path: string) => {
        window.location.href = path
        closeDropdown()
    }

    return (
        <div className='relative'>
            {/* Explore button */}
            <button onClick={toggleDropdown} className='px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1'>
                Explore
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className='absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg boder z-50'>
                    {/* New Arrivals */}
                    <button onClick={() => handleNavigation('/arrivals')}
                        className='w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b'>
                        <div className='font-medium'>
                            New Arrivals
                        </div>
                    </button>
                    {/* Trending */}
                    <button onClick={() => handleNavigation('/trending')}
                        className='w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b'>
                        <div className='font-medium'>
                            Trending
                        </div>
                    </button>
                    {/* Shop by Categories */}
                    <div className='px-4 py-2 text-xs font-semibold text-gray-500 uppercase'>
                        Shop by Categories
                    </div>
                    {categories.map((category) => (
                        <button onClick={() => handleNavigation(`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`)}
                            className='w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50'>
                            {category.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}


