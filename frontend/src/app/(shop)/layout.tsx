'use client'

import { useState, useEffect } from 'react'
import { API_URL } from '@/lib/api'
import Header from '@/components/layout/Header'
import FloatingAIButton from '@/components/ai/FloatingAIButton'
import * as cartService from '@/services/cartService'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userRole, setUserRole] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [cartItemCount, setCartItemCount] = useState(0)

    const loadCartCount = async () => {
        try {
            const data = await cartService.getCart()
            setCartItemCount(data.itemCount || 0)
        } catch (error) {
            console.error('Failed to load cart count:', error)
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken')
            const userData = localStorage.getItem('userData')

            if (token && userData) {
                try {
                    // Verify token is still valid with backend
                    const response = await fetch(`${API_URL}/api/auth/verify`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    if (response.ok) {
                        // Token is valid
                        const data = await response.json()
                        setIsLoggedIn(true)
                        setUserName(data.user.name || 'User')
                        setUserEmail(data.user.email || '')
                        setUserRole(data.user.role || 'customer')

                        // Load cart count
                        loadCartCount()
                    } else {
                        // Token expired or invalid
                        console.log('Token expired, logging out...')
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('userData')
                        setIsLoggedIn(false)
                        setUserName('')
                        setUserEmail('')
                        setUserRole('')
                    }
                } catch (error) {
                    // Network error or other issue
                    console.error('Auth check failed:', error)
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('userData')
                    setIsLoggedIn(false)
                }
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



    useEffect(() => {
        (window as any).refreshCartCount = loadCartCount
        return () => {
            delete (window as any).refreshCartCount
        }
    }, [])

    if (isLoading) {
        return <div className='min-h-screen flex items-center justify-center'>Loading...</div>
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header isLoggedIn={isLoggedIn} userName={userName} userEmail={userEmail} userRole={userRole} cartItemCount={cartItemCount} />
            {children}

            {/* Floating AI Assistant */}
            <FloatingAIButton />
        </div>
    )
}