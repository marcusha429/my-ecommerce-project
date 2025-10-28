import { useState, useEffect } from 'react'
import { Product } from '@/types/product'
import { api } from '@/lib/api'

export function useProducts() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch featured products
                const featuredData = await api.get('/api/products/featured')
                setFeaturedProducts(featuredData)

                // Fetch trending products
                const trendingData = await api.get('/api/products/trending')
                const trendingOnly = trendingData.filter((product: Product) => !product.featured)
                setTrendingProducts(trendingOnly)

                setIsLoading(false)
            } catch (err) {
                console.error('Error fetching products:', err)
                setError('Failed to load products')
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [])

    return {
        featuredProducts,
        trendingProducts,
        isLoading,
        error
    }
}