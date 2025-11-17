'use client'

import { useState } from 'react'

interface ImageUploadProps {
    onImageUploaded: (imageUrl: string, publicId: string) => void
    maxImages?: number
}

export default function ImageUpload({ onImageUploaded, maxImages = 5 }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file (jpg, png, gif, webp)')
            return
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB')
            return
        }

        // Show preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        // Upload to backend
        await uploadImage(file)
    }

    const uploadImage = async (file: File) => {
        try {
            setUploading(true)
            setError(null)
            setUploadProgress(0)

            const token = localStorage.getItem('accessToken')
            if (!token) {
                throw new Error('You must be logged in to upload images')
            }

            // Create form data
            const formData = new FormData()
            formData.append('image', file)

            // Upload to backend
            const response = await fetch('http://localhost:5000/api/upload/image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || data.details || 'Failed to upload image')
            }

            setUploadProgress(100)

            // Call parent callback with uploaded image URL
            onImageUploaded(data.imageUrl, data.publicId)

            // Success message
            alert(`✓ Image uploaded successfully!`)

        } catch (error: any) {
            console.error('Upload error:', error)
            setError(error.message || 'Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const file = e.dataTransfer.files?.[0]
        if (file) {
            // Create a fake input event
            const input = document.createElement('input')
            input.type = 'file'
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(file)
            input.files = dataTransfer.files

            handleFileSelect({ target: input } as any)
        }
    }

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${uploading ? 'border-gray-300 bg-gray-50' : 'border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50'
                    }`}
            >
                {previewUrl && !uploading && (
                    <div className="mb-4">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-w-xs max-h-48 mx-auto rounded-lg shadow-md"
                        />
                    </div>
                )}

                {uploading ? (
                    <div className="space-y-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                        <p className="text-gray-600">Uploading to cloud...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                            <div
                                className="bg-emerald-600 h-2 rounded-full transition-all"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <>
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={uploading}
                        />
                        <label
                            htmlFor="image-upload"
                            className="cursor-pointer block"
                        >
                            <div className="text-6xl mb-4">📸</div>
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-gray-500">
                                JPG, PNG, GIF, WEBP (max 5MB)
                            </p>
                        </label>
                    </>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Upload Failed</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Info */}
            <div className="text-sm text-gray-500">
                <p>• Images will be automatically resized and optimized</p>
                <p>• Maximum {maxImages} images per product</p>
                <p>• Supported formats: JPG, PNG, GIF, WEBP</p>
            </div>
        </div>
    )
}
