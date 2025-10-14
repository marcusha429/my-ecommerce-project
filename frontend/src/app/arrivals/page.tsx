'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import ProductGrid from '@/components/products/ProductGrid'
import { useProducts } from '@/hooks/useProduct'

export default function ArrivalsPage() {
    const { featuredProducts, isLoading } = useProducts()

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <>
            <Header isLoggedIn={true} />
            <ProductGrid
                products={featuredProducts}
                title="New Arrivals"
                emptyMessage="No new arrivals at the moment"
            />
        </>
    )
}