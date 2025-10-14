import { useState } from 'react'
import { HiUser } from 'react-icons/hi2'

interface AccountDropDownProps {
    isLoggedIn: boolean
    userName?: string
    userEmail?: string
    onLogout?: () => void
}

export default function AccountDropDown({ isLoggedIn, userName, userEmail, onLogout }: AccountDropDownProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev)
    }

    const closeDropdown = () => {
        setIsOpen(false)
    }

    return (
        <div className='relative'>
            {/* User Icon Button */}
            <button
                onClick={toggleDropdown}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors'
            >
                <HiUser className='w-6 h-6 text-gray-700' />
            </button>
            {/* Dropdown Menu (only show if isOpen) */}
            {isOpen && (
                <div className='absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border'>
                    {isLoggedIn ? (
                        // LOGGED IN: User info + menu
                        <>
                            <div className='p-3 border-b'>
                                <p className='text-sm font-medium text-gray-900'>{userName}</p>
                                <p className='text-xs text-gray-500'>{userEmail}</p>
                            </div>
                            <button className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'>
                                Profile
                            </button>
                            <button className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'>
                                Orders
                            </button>
                            <button
                                onClick={onLogout}
                                className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t'
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        // NOT LOGGED IN: Sign In + Sign Up buttons
                        <>
                            <button
                                onClick={() => window.location.href = '/auth/signin'}
                                className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => window.location.href = '/auth/signup'}
                                className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

