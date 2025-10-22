'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HiViewGrid, HiShoppingBag, HiShoppingCart, HiUsers } from 'react-icons/hi'

export default function Sidebar() {
    const pathname = usePathname()

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: HiViewGrid },
        { name: 'Products', href: '/admin/products', icon: HiShoppingBag },
        { name: 'Orders', href: '/admin/orders', icon: HiShoppingCart },
        { name: 'Users', href: '/admin/users', icon: HiUsers },
    ]

    return (
        <aside className='w-64 bg-gray-900 text-white min-h-screen'>
            <div className='p-6'>
                <h1 className='text-2xl font-bold'>Admin Portal</h1>
            </div>

            <nav className='mt-6'>
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.name} href={item.href}
                            className={`flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors ${isActive ? 'bg-gray-800 border-l-4 border-blue-500' : ''}`}>
                            <Icon className='w-5 h-5' />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}