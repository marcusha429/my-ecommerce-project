'use client'

import ProductGrid from '@/components/products/ProductGrid'
import { useProducts } from '@/hooks/useProduct'

export default function ArrivalsPage() {
    const { toppickProducts, isLoading } = useProducts()

    if (isLoading) {
        return (
            <div className='flex items-center justify-center py-12'>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <ProductGrid
            products={toppickProducts}
            title="Top Picked"
            emptyMessage="No top picked items at the moment"
        />
    )
}