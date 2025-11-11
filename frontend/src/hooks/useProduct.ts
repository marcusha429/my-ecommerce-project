import { useState, useEffect } from 'react'
import { Product } from '@/types/product'
import { api } from '@/lib/api'

export function useProducts() {
    const [toppickProducts, setToppickProducts] = useState<Product[]>([])
    const [popularProducts, setPopularProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch toppick products
                const toppickData = await api.get('/api/products/toppick')
                setToppickProducts(toppickData)

                // Fetch popular products
                const popularData = await api.get('/api/products/popular')
                const popularOnly = popularData.filter((product: Product) => !product.toppick)
                setPopularProducts(popularOnly)

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
        toppickProducts,
        popularProducts,
        isLoading,
        error
    }
}