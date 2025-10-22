'use client'

import ProductGrid from '@/components/products/ProductGrid'
import { useProducts } from '@/hooks/useProduct'

export default function ArrivalsPage() {
    const { featuredProducts, isLoading } = useProducts()

    if (isLoading) {
        return (
            <div className='flex items-center justify-center py-12'>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <ProductGrid
            products={featuredProducts}
            title="New Arrivals"
            emptyMessage="No new arrivals at the moment"
        />
    )
}