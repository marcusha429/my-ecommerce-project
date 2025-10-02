import { useState, useEffect } from 'react'
import { Product } from '@/types/product'

export function useProducts() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch featured products
                const featuredResponse = await fetch('http://localhost:5000/api/products/featured')
                const featuredData = await featuredResponse.json()
                setFeaturedProducts(featuredData)

                // Fetch trending products
                const trendingResponse = await fetch('http://localhost:5000/api/products/trending')
                const trendingData = await trendingResponse.json()
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