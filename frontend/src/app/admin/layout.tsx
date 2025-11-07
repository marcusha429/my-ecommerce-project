'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check if user has valid access token
        const token = localStorage.getItem('accessToken')

        if (!token) {
            // No token - redirect to login
            router.replace('/auth/signin')
        } else {
            // Token exists - allow access
            setIsAuthenticated(true)
        }

        setIsLoading(false)
    }, [router])

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <p>Loading...</p>
            </div>
        )
    }

    // Don't render admin content if not authenticated
    if (!isAuthenticated) {
        return null
    }

    return (
        <div className='flex min-h-screen bg-gray-100'>
            <Sidebar />
            <main className='flex-1 ml-64'>
                {children}
            </main>
        </div>
    )
}