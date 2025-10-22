'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken')
            if (token) {
                setIsLoggedIn(true)
                setUserName('John Doe')
                setUserEmail('john@example.com')
            } else {
                setIsLoggedIn(false)
                setUserName('')
                setUserEmail('')
            }
            setIsLoading(false)
        }
        checkAuth()
    }, [])

    if (isLoading) {
        return <div className='min-h-screen flex items-center justify-center'>Loading...</div>
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header isLoggedIn={isLoggedIn} userName={userName} userEmail={userEmail} />
            {children}
        </div>
    )
}