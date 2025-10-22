'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ProductGrid from '@/components/products/ProductGrid'
import { Product } from '@/types/product'
import { categories } from '@/constants/mockData'

export default function CategoryPage() {
    const params = useParams()
    const categorySlug = params.id as string

    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    //Find categories name
    const category = categories.find(cat => cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug)
    const categoryName = category?.name || 'Category'

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/category/${categorySlug}`)
                const data = await response.json()
                setProducts(data)
            } catch (error) {
                console.error('Error fetching category products:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategoryProducts()
    }, [categorySlug])

    if (isLoading) {
        return (
            <div className='flex items-center justify-center py-12'>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <ProductGrid
            products={products}
            title={categoryName}
            emptyMessage={`No products found in ${categoryName}`}
        />
    )
}