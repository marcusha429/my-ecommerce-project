'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { HiViewGrid, HiShoppingBag, HiShoppingCart, HiUsers, HiLogout } from 'react-icons/hi'
import { authService } from '@/lib/auth'

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await authService.logout()
            router.replace('/auth/signin')
        } catch (error) {
            console.error('Logout failed:', error)
            //force log out
            localStorage.removeItem('accessToken')
            router.replace('/auth/signin')
        }
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: HiViewGrid },
        { name: 'Products', href: '/admin/products', icon: HiShoppingBag },
        { name: 'Orders', href: '/admin/orders', icon: HiShoppingCart },
        { name: 'Users', href: '/admin/users', icon: HiUsers },
    ]

    return (
        <aside className='w-64 bg-gray-900 text-white min-h-screen flex flex-col fixed top-0 left-0'>
            <div className='p-6'>
                <h1 className='text-2xl font-bold'>Admin Portal</h1>
            </div>

            <nav className='mt-6 flex-1'>
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.name} href={item.href}
                            className={`flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors ${isActive ? 'bg-gray-800 border-l-4 border-emerald-500' : ''}`}>
                            <Icon className='w-5 h-5' />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
            {/* Logout Button */}
            <div className='p-6 border-t border-gray-700'>
                <button
                    onClick={handleLogout}
                    className='flex items-center gap-3 px-6 py-3 w-full hover:bg-gray-800 rounded-lg transition-colors'>
                    <HiLogout className='w-5 h-5' />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}