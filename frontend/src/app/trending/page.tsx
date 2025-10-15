'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import ProductGrid from '@/components/products/ProductGrid'
import { useProducts } from '@/hooks/useProduct'

export default function ArrivalsPage() {
    const { trendingProducts, isLoading } = useProducts()

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
                products={trendingProducts}
                title="Trending"
                emptyMessage="No Trending products at the moment"
            />
        </>
    )
}