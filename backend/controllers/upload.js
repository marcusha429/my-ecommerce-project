const { uploadImage, deleteImage } = require('../config/cloudinary')
const fs = require('fs')

/**
 * POST /api/upload/image
 * Upload a single image to Cloudinary
 *
 * This endpoint:
 * 1. Receives file from multer (saved to temp folder)
 * 2. Uploads to Cloudinary
 * 3. Deletes temp file
 * 4. Returns Cloudinary URL
 */

exports.uploadProductImage = async (req, res) => {
    try {
        //check if file was upload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No file upload"
            })
        }
        console.log("file received:", req.file.filename)

        //upload to cloudinary
        const result = await uploadImage(req.file.path, 'product')

        //delete temporary file from server
        fs.unlinkSync(req.file.path)

        console.log('Image uploaded to Cloudinary:', result.url)

        //return cloudinary url
        res.json({
            success: true,
            message: "image upload successfully",
            imageUrl: result.url,
            publicId: result.publicId,
            width: result.width,
            height: result.height,
            format: result.format
        })
    } catch (error) {
        console.error('Upload error', error)
        res.status(500).json({
            success: false,
            error: "Failed to upload image",
            details: error.message
        })
    }
}

/**
 * POST /api/upload/multiple
 * Upload multiple images to Cloudinary (up to 5)
 */

exports.uploadMultipleImages = async (req, res) => {
    try {
        //check if files was uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No files uploaded'
            })
        }
        console.log(`Uploading ${req.files.length} files...`)

        //upload all files to cloudinary
        const uploadPromises = req.files.map(file => uploadImage(file.path, 'products'))
        const results = await Promise.all(uploadPromises)

        //delete all temporary files
        req.files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path)
            }
        })

        console.log('All images uploaded successfully')

        //return array of cloudinary files
        res.json({
            success: true,
            message: `${results.length} images uploaded successfully`,
            images: results.map(r => ({
                url: r.url,
                publicId: r.publicId,
                width: r.width,
                height: r.height,
                format: r.format
            }))
        })

    } catch (error) {
        // Clean up temp files if upload failed
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path)
                }
            })
        }

        console.error('Multiple upload error:', error)
        res.status(500).json({
            success: false,
            error: 'Failed to upload images',
            details: error.message
        })
    }
}

/**
 * DELETE /api/upload/image/:publicId
 * Delete an image from Cloudinary
 */
exports.deleteProductImage = async (req, res) => {
    try {
        const { publicId } = req.params

        if (!publicId) {
            return res.status(400).json({
                success: false,
                error: 'Public ID is required'
            })
        }

        // Delete from Cloudinary
        const result = await deleteImage(publicId)

        res.json({
            success: true,
            message: 'Image deleted successfully',
            result
        })

    } catch (error) {
        console.error('Delete error:', error)
        res.status(500).json({
            success: false,
            error: 'Failed to delete image',
            details: error.message
        })
    }
}
