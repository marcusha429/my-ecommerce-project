'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userRole, setUserRole] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken')
            const userData = localStorage.getItem('userData')
            if (token && userData) {
                const user = JSON.parse(userData)
                setIsLoggedIn(true)
                setUserName(user.name || 'User')
                setUserEmail(user.email || '')
                setUserRole(user.role || 'customer')
            } else {
                setIsLoggedIn(false)
                setUserName('')
                setUserEmail('')
                setUserRole('')
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
            <Header isLoggedIn={isLoggedIn} userName={userName} userEmail={userEmail} userRole={userRole} />
            {children}
        </div>
    )
}