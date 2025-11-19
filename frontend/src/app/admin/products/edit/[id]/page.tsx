'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Product } from '@/types/product'
import NutritionSearchModal from '@/components/NutritionSearchModal'
import { NutritionData } from '@/lib/usda'
import ImageUpload from '@/components/admin/ImageUpload'

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const productId = params.id as string
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showNutritionModal, setShowNutritionModal] = useState(false)

    //Form
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        stock: '',
        images: [''],
        toppick: false,
        popular: false
    })

    //Load data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product: Product = await api.get(`/api/products/${productId}`)

                //Pre-fill form if existed data
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price.toString(),
                    category: product.category,
                    brand: product.brand,
                    stock: product.stock.toString(),
                    images: product.images.length > 0 ? product.images : [''],
                    toppick: product.toppick,
                    popular: product.popular
                })
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching product:', error)
                alert('Failed to load product data.')
                router.push('/admin/products')
            }
        }
        fetchProduct()
    }, [productId])

    //INput change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        if (type == 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else {
            // Allow free typing without formatting
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleNutritionSelect = (nutrition: NutritionData) => {
        setFormData(prev => ({
            ...prev,
            nutrition: {
                calories: nutrition.calories.toString(),
                protein: nutrition.protein.toString(),
                carbs: nutrition.carbs.toString(),
                fat: nutrition.fat.toString(),
                fiber: nutrition.fiber.toString()
            }
        }))
    }

    //Submit Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock, 10),
                images: formData.images.filter(img => img.trim() !== '')
            }

            //Call API to update product (require admin auth)
            const response = await api.put(`/api/products/${productId}`, productData)

            if (response.success !== false) {
                alert('Product updated successfully')
                router.push('/admin/products')
            } else {
                alert(`Faled to updated product: ${response.message}`)
            }
        } catch (error) {
            console.error('Error updating product:', error)
            alert('An error occurred while updating the product.')
        } finally {
            setIsSubmitting(false)
        }
    }

    //Loading before fetch product
    if (isLoading) {
        return (
            <div className='flex items-center justify-center p-12'>
                <p>Loading product...</p>
            </div>
        )
    }

    return (
        //Main  container
        <div className='p-8 max-w-4xl mx-auto'>
            {/*Page title*/}
            <h1 className='text-3xl font-bold text-gray-800 mb-8'>Edit Product</h1>
            {/*Form*/}
            <form onSubmit={handleSubmit} className='bg-white rounded-lg shadow p-6 sapce-y-6'>
                {/*Product Name*/}
                <div>
                    <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Product Name'
                        required
                        className='w-full border border-gray-300 rounded px-4 py-2 text-black focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                    />
                </div>
                {/*Description*/}
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
                    <textarea
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                    />
                </div>
                {/*Price ans Stock*/}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Price ($)</label>
                        <input
                            type='text'
                            name='price'
                            value={formData.price}
                            onChange={handleChange}
                            required
                            placeholder='0.00'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Stock Quantity</label>
                        <input
                            type='number'
                            name='stock'
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min='0'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                        />
                    </div>
                </div>
                {/*Category & Brand*/}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                        <select
                            name='category'
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                        >
                            <option value=''>Select a category</option>
                            <option value='fruits-vegetables'>Fruits & Vegetables</option>
                            <option value='dairy-eggs'>Dairy & Eggs</option>
                            <option value='meat-seafood'>Meat & Seafood</option>
                            <option value='bakery'>Bakery</option>
                            <option value='beverages'>Beverages</option>
                            <option value='snacks'>Snacks</option>
                            <option value='pantry'>Pantry Staples</option>
                        </select>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Brand</label>
                        <input
                            type='text'
                            name='brand'
                            value={formData.brand}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                        />
                    </div>
                </div>
                {/* Product Images */}
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Product Images</label>
                    <ImageUpload
                        onImageUploaded={(imageUrl) => {
                            setFormData(prev => ({
                                ...prev,
                                images: [...prev.images.filter(img => img !== ''), imageUrl]
                            }))
                        }}
                        maxImages={5}
                    />

                    {/* Display uploaded images */}
                    {formData.images.filter(img => img !== '').length > 0 && (
                        <div className='mt-4'>
                            <p className='text-sm font-medium text-gray-700 mb-2'>
                                Current Images ({formData.images.filter(img => img !== '').length})
                            </p>
                            <div className='grid grid-cols-4 gap-2'>
                                {formData.images.filter(img => img !== '').map((img, idx) => (
                                    <div key={idx} className='relative group'>
                                        <img
                                            src={img}
                                            alt={`Product ${idx + 1}`}
                                            className='w-full h-24 object-cover rounded border border-gray-200'
                                        />
                                        <button
                                            type='button'
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    images: prev.images.filter((_, i) => i !== idx)
                                                }))
                                            }}
                                            className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/*Top Picks & Popular with Checkbox*/}
                <div className='flex gap-6'>
                    <div className='flex items-center'>
                        <input
                            type='checkbox'
                            name='toppick'
                            checked={formData.toppick}
                            onChange={handleChange}
                            className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500'
                        />
                        <label className='ml-2 text-sm font-medium text-gray-700'>Top Picks Product</label>
                    </div>

                    <div className='flex items-center'>
                        <input
                            type='checkbox'
                            name='popular'
                            checked={formData.popular}
                            onChange={handleChange}
                            className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500'
                        />
                        <label className='ml-2 text-sm font-medium text-gray-700'>Popular Product</label>
                    </div>
                </div>

                {/* Search Nutrition Button */}
                <div className='flex justify-end'>
                    <button
                        type='button'
                        onClick={() => setShowNutritionModal(true)}
                        className='bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-2'
                    >
                        <span>🔍</span>
                        Search USDA Nutrition Database
                    </button>
                </div>

                {/*Submit Cancel button*/}
                <div className='flex gap-4 pt-4'>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400'
                    >
                        {isSubmitting ? 'Updating...' : 'Update Product'}
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
            {/* Nutrition Search Modal */}
            <NutritionSearchModal
                isOpen={showNutritionModal}
                onClose={() => setShowNutritionModal(false)}
                onSelect={handleNutritionSelect}
            />
        </div>
    )
}