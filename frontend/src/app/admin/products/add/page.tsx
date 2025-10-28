'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function AddProductPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        stock: '',
        images: [''],
        featured: false,
        trending: false
    })

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target

        // Handle checkboxes differently
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Convert price and stock to numbers
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images: formData.images.filter(img => img.trim() !== '') // Remove empty images
            }

            // Call API to create product (requires admin auth)
            const response = await api.post('/api/products', productData, true)

            if (response.success !== false) {
                alert('Product created successfully!')
                router.push('/admin/products')
            } else {
                alert(`Failed to create product: ${response.message}`)
            }
        } catch (error) {
            console.error('Error creating product:', error)
            alert('Error creating product')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        // Main container
        <div className='p-8 max-w-4xl mx-auto'>

            {/* Page title */}
            <h1 className='text-3xl font-bold text-gray-800 mb-8'>Add New Product</h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className='bg-white rounded-lg shadow p-6 space-y-6'>

                {/* Product Name */}
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Product Name</label>
                    <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='e.g., iPhone 15 Pro'
                    />
                </div>

                {/* Description */}
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
                    <textarea
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='Product description...'
                    />
                </div>

                {/* Price & Stock - Side by side */}
                <div className='grid grid-cols-2 gap-4'>
                    {/* Price */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Price ($)</label>
                        <input
                            type='number'
                            name='price'
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min='0'
                            step='0.01'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='0.00'
                        />
                    </div>

                    {/* Stock */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Stock Quantity</label>
                        <input
                            type='number'
                            name='stock'
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min='0'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='0'
                        />
                    </div>
                </div>

                {/* Category & Brand - Side by side */}
                <div className='grid grid-cols-2 gap-4'>
                    {/* Category */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                        <input
                            type='text'
                            name='category'
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='e.g., electronics'
                        />
                    </div>

                    {/* Brand */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Brand</label>
                        <input
                            type='text'
                            name='brand'
                            value={formData.brand}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder='e.g., Apple'
                        />
                    </div>
                </div>

                {/* Image URL */}
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Image URL</label>
                    <input
                        type='url'
                        value={formData.images[0]}
                        onChange={(e) => setFormData(prev => ({ ...prev, images: [e.target.value] }))}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='https://example.com/image.jpg'
                    />
                    <p className='text-xs text-gray-500 mt-1'>Enter a direct URL to the product image</p>
                </div>

                {/* Featured & Trending - Checkboxes */}
                <div className='flex gap-6'>
                    {/* Featured */}
                    <div className='flex items-center'>
                        <input
                            type='checkbox'
                            name='featured'
                            checked={formData.featured}
                            onChange={handleChange}
                            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                        />
                        <label className='ml-2 text-sm font-medium text-gray-700'>Featured Product</label>
                    </div>

                    {/* Trending */}
                    <div className='flex items-center'>
                        <input
                            type='checkbox'
                            name='trending'
                            checked={formData.trending}
                            onChange={handleChange}
                            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                        />
                        <label className='ml-2 text-sm font-medium text-gray-700'>Trending Product</label>
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex gap-4 pt-4'>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400'
                    >
                        {isSubmitting ? 'Creating...' : 'Create Product'}
                    </button>

                    <button
                        type='button'
                        onClick={() => router.push('/admin/products')}
                        className='bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors'
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}