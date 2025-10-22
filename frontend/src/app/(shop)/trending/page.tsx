'use client'

import ProductGrid from '@/components/products/ProductGrid'
import { useProducts } from '@/hooks/useProduct'

export default function TrendingPage() {
    const { trendingProducts, isLoading } = useProducts()

    if (isLoading) {
        return (
            <div className='flex items-center justify-center py-12'>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <ProductGrid
            products={trendingProducts}
            title="Trending"
            emptyMessage="No Trending products at the moment"
        />
    )
}