/*
┌────────────────────────────────────────────────────────────────┐
│  Logo  │ Explore │ Account │ Support │  [Search Bar]  │ 🛒 │ ☰
└────────────────────────────────────────────────────────────────┘
*/

'use client'

import Link from 'next/link'
import { authService } from '@/lib/auth'
import Logo from '@/components/header/Logo'
import SearchBar from '@/components/header/SearchBar'
import AccountDropDown from '@/components/header/Account'
import Explore from '@/components/header/Explore'
import { HiLockClosed } from 'react-icons/hi'

interface HeaderProps {
    userName?: string
    userEmail?: string
    isLoggedIn?: boolean
    userRole?: string
}

export default function Header({
    userName = 'John Doe',
    userEmail = 'john@example.com',
    isLoggedIn = false, //default
    userRole = 'customer'
}: HeaderProps) {

    const handleSearch = (query: string) => {
        console.log('Searching for:', query)
        // TODO: Add real search logic
    }

    const handleLogout = async () => {
        try {
            await authService.logout()
            localStorage.removeItem('accessToken')
            window.location.href = '/auth/signin'
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <header className='bg-white shadow-sm border-b sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-4 md:px-6 py-4'>
                <div className='flex items-center gap-6 md:gap-8'>

                    {/* 1. Logo */}
                    <Logo isLoggedIn={isLoggedIn} />

                    {/* 2. Explore Button Dropdown */}
                    <Explore />

                    {/* Spacer - pushes items to right */}
                    <div className='flex-grow'></div>

                    {/* 3. Search Bar */}
                    <SearchBar onSearch={handleSearch} />

                    {/* 4. Admin Portal Link (only for admins) */}
                    {isLoggedIn && userRole === 'admin' && (
                        <Link
                            href='/admin'
                            className='flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors'
                        >
                            <HiLockClosed className='w-4 h-4' />
                            <span className='font-medium'>Admin Portal</span>
                        </Link>
                    )}

                    {/* 5. Account Dropdown */}
                    <AccountDropDown
                        isLoggedIn={isLoggedIn}
                        userName={userName}
                        userEmail={userEmail}
                        onLogout={handleLogout}
                    />
                </div>
            </div>
        </header>
    )
}