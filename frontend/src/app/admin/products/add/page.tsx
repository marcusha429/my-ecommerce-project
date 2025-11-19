'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import NutritionSearchModal from '@/components/NutritionSearchModal'
import { NutritionData } from '@/lib/usda'
import ImageUpload from '@/components/admin/ImageUpload'

export default function AddProductPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showNutritionModal, setShowNutritionModal] = useState(false)

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
        trending: false,
        unit: 'piece',
        weight: '',
        expirationDate: '',
        organic: false,
        nutrition: {
            calories: '',
            protein: '',
            carbs: '',
            fat: '',
            fiber: ''
        }
    })

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target

        // Handle checkboxes differently
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else {
            // Allow free typing without formatting
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    //Handle nutrition changes
    const handleNutritionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            nutrition: {
                ...prev.nutrition,
                [name]: value
            }
        }))
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
                images: formData.images.filter(img => img.trim() !== ''), // Remove empty images
                nutrition: {
                    calories: formData.nutrition.calories ? parseFloat(formData.nutrition.calories) : undefined,
                    protein: formData.nutrition.protein ? parseFloat(formData.nutrition.protein) : undefined,
                    carbs: formData.nutrition.carbs ? parseFloat(formData.nutrition.carbs) : undefined,
                    fat: formData.nutrition.fat ? parseFloat(formData.nutrition.fat) : undefined,
                    fiber: formData.nutrition.fiber ? parseFloat(formData.nutrition.fiber) : undefined,
                }
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
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-gray-700 focus:border-transparent'
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
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700'
                        placeholder='Product description...'
                    />
                </div>

                {/* Price & Stock - Side by side */}
                <div className='grid grid-cols-2 gap-4'>
                    {/* Price */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Price ($)</label>
                        <input
                            type='text'
                            name='price'
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-black'
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
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700'
                            placeholder='0'
                        />
                    </div>
                </div>

                {/* Category & Brand - Side by side */}
                <div className='grid grid-cols-2 gap-4'>
                    {/* Category */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                        <select
                            name='category'
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700'
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

                    {/* Brand */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Brand</label>
                        <input
                            type='text'
                            name='brand'
                            value={formData.brand}
                            onChange={handleChange}
                            required
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700'
                            placeholder='e.g., Apple'
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
                                Uploaded Images ({formData.images.filter(img => img !== '').length})
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

                {/* Unit & Weight - Side by side */}
                <div className='grid grid-cols-2 gap-4'>
                    {/* Unit */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Unit</label>
                        <select
                            name='unit'
                            value={formData.unit}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700'
                        >
                            <option value='piece'>Piece</option>
                            <option value='lb'>Pound (lb)</option>
                            <option value='kg'>Kilogram (kg)</option>
                            <option value='oz'>Ounce (oz)</option>
                            <option value='dozen'>Dozen</option>
                            <option value='gallon'>Gallon</option>
                            <option value='liter'>Liter</option>
                        </select>
                    </div>

                    {/* Weight */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Weight (optional)
                        </label>
                        <input
                            type='number'
                            name='weight'
                            value={formData.weight}
                            onChange={handleChange}
                            step='0.01'
                            placeholder='Enter weight'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700'
                        />
                    </div>
                </div>
                {/* Expiration Date & Organic - Side by side */}
                <div className='grid grid-cols-2 gap-4'>
                    {/* Expiration Date */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Expiration Date (optional)
                        </label>
                        <input
                            type='date'
                            name='expirationDate'
                            value={formData.expirationDate}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700'
                        />
                    </div>

                    {/* Organic Checkbox */}
                    <div className='flex items-center pt-8'>
                        <input
                            type='checkbox'
                            name='organic'
                            checked={formData.organic}
                            onChange={handleChange}
                            className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500'
                        />
                        <label className='ml-2 text-sm font-medium text-gray-700'>
                            Organic Product
                        </label>
                    </div>
                </div>

                {/* Nutrition Information */}
                <div>
                    <div className='flex justify-between items-center mb-4'>
                        <h3 className='text-lg font-semibold text-gray-800'>Nutrition Information (Optional)</h3>
                        <button
                            type='button'
                            onClick={() => setShowNutritionModal(true)}
                            className='bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-2'
                        >
                            <span>🔍</span>
                            Search USDA Nutrition Database
                        </button>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        {/* Calories */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Calories</label>
                            <input
                                type='number'
                                name='calories'
                                value={formData.nutrition.calories}
                                onChange={handleNutritionChange}
                                step='0.1'
                                placeholder='Enter calories'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700'
                            />
                        </div>
                        {/* Protein */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Protein (g)
                            </label>
                            <input
                                type='number'
                                name='protein'
                                value={formData.nutrition.protein}
                                onChange={handleNutritionChange}
                                step='0.1'
                                placeholder='Enter protein'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700'
                            />
                        </div>

                        {/* Carbs */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Carbs (g)
                            </label>
                            <input
                                type='number'
                                name='carbs'
                                value={formData.nutrition.carbs}
                                onChange={handleNutritionChange}
                                step='0.1'
                                placeholder='Enter carbs'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700'
                            />
                        </div>

                        {/* Fat */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Fat (g)
                            </label>
                            <input
                                type='number'
                                name='fat'
                                value={formData.nutrition.fat}
                                onChange={handleNutritionChange}
                                step='0.1'
                                placeholder='Enter fat'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700'
                            />
                        </div>

                        {/* Fiber */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Fiber (g)
                            </label>
                            <input
                                type='number'
                                name='fiber'
                                value={formData.nutrition.fiber}
                                onChange={handleNutritionChange}
                                step='0.1'
                                placeholder='Enter fiber'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700'
                            />
                        </div>
                    </div>
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
                            className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500'
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
                            className='w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500'
                        />
                        <label className='ml-2 text-sm font-medium text-gray-700'>Trending Product</label>
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex gap-4 pt-4'>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400'
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
            </form >
            {/* Nutrition Search Modal */}
            <NutritionSearchModal
                isOpen={showNutritionModal}
                onClose={() => setShowNutritionModal(false)}
                onSelect={handleNutritionSelect}
            />
        </div >
    )
}