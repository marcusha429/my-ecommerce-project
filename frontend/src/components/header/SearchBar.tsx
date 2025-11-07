import { useState } from 'react'
import { HiMagnifyingGlass } from 'react-icons/hi2'

interface SearchBarProps {
    onSearch: (query: string) => void
    placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = 'Search products...' }: SearchBarProps) {
    // 4. State - add useState here
    const [searchQuery, setSearchQuery] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)
    // 5. Functions - we'll add later
    const handleExpand = () => {
        setIsExpanded(true)
    }

    const handleCollapse = () => {
        if (searchQuery.trim() === '') {
            setIsExpanded(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(searchQuery)
        setIsExpanded(false)
    }
    // 6. Return JSX - we'll add later
    return (
        <div className='relative'>
            {isExpanded ? (
                // EXPANDED: Show search form
                <form onSubmit={handleSubmit} className='flex items-center'>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={placeholder}
                        onBlur={handleCollapse}
                        autoFocus
                        className='w-64 px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                    />
                    {/* Icon inside input - position absolute */}
                    <HiMagnifyingGlass className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none' />
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


