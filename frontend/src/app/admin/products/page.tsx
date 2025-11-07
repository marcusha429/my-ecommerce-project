'use client'

import { useState, useEffect } from 'react'
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi'
import Link from 'next/link'
import { Product } from '@/types/product'
import { api } from '@/lib/api'

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.get('/api/products')
                setProducts(data)
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [])

    //Delete product handler
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) {
            return
        }

        try {
            // Before: Manual fetch with token
            // After: API helper handles token automatically
            const response = await api.delete(`/api/products/${id}`)

            if (response.ok) {
                setProducts(products.filter(p => p._id !== id))
                alert('Product deleted successfully!')
            } else {
                const error = await response.json()
                alert(`Failed to delete: ${error.message}`)
            }
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('Error deleting product')
        }
    }
    if (isLoading) {
        return (
            <div className='flex items-center justify-center p-12'>
                <p>Loading products...</p>
            </div>
        )
    }

    return (
        // Main container
        <div className='p-8'>

            {/* Header - title and Add button */}
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-3xl font-bold text-gray-800'>Products</h1>

                <Link
                    href='/admin/products/add'
                    className='bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2'
                >
                    <HiPlus className='w-5 h-5' />
                    Add Product
                </Link>
            </div>

            {/* Products table */}
            <div className='bg-white rounded-lg shadow overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>

                        {/* Table header */}
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Image</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Name</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Category</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Price</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Stock</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Status</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Actions</th>
                            </tr>
                        </thead>

                        {/* Table body */}
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {products.map((product) => (
                                <tr key={product._id} className='hover:bg-gray-50'>

                                    {/* Image */}
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <img
                                            src={product.images[0] || '/placeholder.png'}
                                            alt={product.name}
                                            className='h-12 w-12 rounded object-cover'
                                        />
                                    </td>

                                    {/* Name & Brand */}
                                    <td className='px-6 py-4'>
                                        <div className='text-sm font-medium text-gray-900'>{product.name}</div>
                                        <div className='text-sm text-gray-500'>{product.brand}</div>
                                    </td>

                                    {/* Category */}
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='text-sm text-gray-900'>{product.category}</span>
                                    </td>

                                    {/* Price */}
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='text-sm font-semibold text-gray-900'>${product.price}</span>
                                    </td>

                                    {/* Stock */}
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <span className='text-sm text-gray-900'>{product.stock}</span>
                                    </td>

                                    {/* Status badges */}
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='flex gap-1'>
                                            {product.featured && (
                                                <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>Featured</span>
                                            )}
                                            {product.trending && (
                                                <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>Trending</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Actions - Edit & Delete */}
                                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                                        <div className='flex gap-2'>
                                            <Link
                                                href={`/admin/products/edit/${product._id}`}
                                                className='text-emerald-600 hover:text-blue-800'
                                            >
                                                <HiPencil className='w-5 h-5' />
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(product._id, product.name)}
                                                className='text-red-600 hover:text-red-800'
                                            >
                                                <HiTrash className='w-5 h-5' />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty state */}
            {products.length === 0 && (
                <div className='text-center py-12'>
                    <p className='text-gray-500'>No products found. Add your first product!</p>
                </div>
            )}
        </div>
    )
}