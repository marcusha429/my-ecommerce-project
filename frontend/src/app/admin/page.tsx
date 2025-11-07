'use client'

import { useState, useEffect, use } from 'react'
import { HiShoppingBag, HiShoppingCart, HiUsers, HiCurrencyDollar } from 'react-icons/hi'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0
    })
    useEffect(() => {
        //fetch admin stats from backend API
        setStats({
            totalProducts: 24,
            totalOrders: 150,
            totalUsers: 89,
            totalRevenue: 12500
        })
    }, [])
    const statCards = [
        { title: 'Total Products', value: stats.totalProducts, icon: HiShoppingBag, color: 'blue' },
        { title: 'Total Orders', value: stats.totalOrders, icon: HiShoppingCart, color: 'green' },
        { title: 'Total Users', value: stats.totalUsers, icon: HiUsers, color: 'purple' },
        { title: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: HiCurrencyDollar, color: 'yellow' }
    ]
    return (
        //main content area - add padding
        <div className='p-8'>
            {/* Page Title */}
            <h1 className='text-3xl font-bold text-gray-800 mb-8'>Dashboard</h1>
            {/* Stat Grids */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {/* Render Stat Card */}
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        //Single stat card
                        <div key={stat.title} className='bg-white rounded-lg shadow p-6'>
                            {/* Card Container */}
                            <div className='flex items-center justify-between'>
                                {/* Left side (title and value) spread if don't have */}
                                <div>
                                    <p className='text-sm text-gray-600 mb-1'>{stat.title}</p>
                                    <p className='text-2xl font-bold text-gray-800'>{stat.value}</p>
                                </div>
                                {/* Right side (icon) */}
                                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                                    <Icon className={`w-6 h-6 text-${stat.color}-600`}></Icon>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* Quick Actions Section */}
            <div className='mt-8'>
                {/* Section Title */}
                <h2 className='text-xl font-semibold text-gray-800 mb-4'>Quick Action</h2>
                {/* Action Buttons Grids - 1 col on mobile, 3 on desktop*/}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {/* Add Product Button */}
                    <button onClick={() => window.location.href = '/admin/products/add'} className='bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors'>Add New Product</button>
                    {/* View Order Button*/}
                    <button className='bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors'>View All Orders</button>
                    {/* Manage Users Button */}
                    <button className='bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors'>Manage Users</button>
                </div>
            </div>
        </div>
    )
}