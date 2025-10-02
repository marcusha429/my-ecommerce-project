'use client'

import { authService } from '@/lib/auth'

interface DashboardHeaderProps {
    userName?: string
    userEmail?: string
}

export default function DashboardHeader({
    userName = 'John Doe',
    userEmail = 'john@example.com'
}: DashboardHeaderProps) {

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
        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
            {/* Left side */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, User</p>
            </div>

            {/* Right side */}
            <div>
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm cursor-pointer"
                >
                    Logout
                </button>
            </div>
        </header>
    )
}