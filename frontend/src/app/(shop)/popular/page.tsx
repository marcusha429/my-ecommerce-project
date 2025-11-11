'use client'

import ProductGrid from '@/components/products/ProductGrid'
import { useProducts } from '@/hooks/useProduct'

export default function TrendingPage() {
    const { popularProducts, isLoading } = useProducts()

    if (isLoading) {
        return (
            <div className='flex items-center justify-center py-12'>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <ProductGrid
            products={popularProducts}
            title="Popular Items"
            emptyMessage="No Popular products at the moment"
        />
    )
}