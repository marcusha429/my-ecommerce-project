const cloudinary = require('cloudinary').v2
require('dotenv').config()

/**
 * Cloudinary Configuration
 *
 * This configures the Cloudinary SDK with your account credentials.
 * The credentials are loaded from CLOUDINARY_URL environment variable.
 * Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
 */
if (process.env.CLOUDINARY_URL) {
    // Cloudinary SDK automatically reads CLOUDINARY_URL
    console.log('✓ Cloudinary configured from CLOUDINARY_URL')
} else {
    console.error('✗ CLOUDINARY_URL not set in .env file')
}

/**
 * Upload an image to Cloudinary
 *
 * @param {string} filePath - Path to the file on local disk
 * @param {string} folder - Folder name in Cloudinary (e.g., 'products')
 * @returns {Promise<object>} - Upload result with secure_url, public_id, etc.
 */
const uploadImage = async (filePath, folder = 'products') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,              // Organize images in folders
            resource_type: 'auto',       // Auto-detect file type
            transformation: [
                { width: 800, height: 800, crop: 'limit' },  // Max dimensions
                { quality: 'auto' },      // Auto-optimize quality
                { fetch_format: 'auto' }  // Auto-select best format (WebP, etc)
            ]
        })

        return {
            url: result.secure_url,      // HTTPS URL to access image
            publicId: result.public_id,  // Unique ID (for deletion later)
            width: result.width,
            height: result.height,
            format: result.format
        }
    } catch (error) {
        console.error('Cloudinary upload error:', error.message)
        throw new Error(`Failed to upload image: ${error.message}`)
    }
}

/**
 * Delete an image from Cloudinary
 *
 * @param {string} publicId - The public_id returned from upload
 * @returns {Promise<object>} - Deletion result
 */
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        return result
    } catch (error) {
        console.error('Cloudinary delete error:', error)
        throw new Error('Failed to delete image from Cloudinary')
    }
}

module.exports = {
    cloudinary,
    uploadImage,
    deleteImage
}
