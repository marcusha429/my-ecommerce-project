const multer = require('multer')
const path = require('path')
const fs = require('fs')

/**
 * Multer Middleware for File Uploads
 *
 * This handles file uploads from the frontend and temporarily stores them
 * on the server disk before uploading to Cloudinary.
 */

// For serverless (Vercel), use memory storage instead of disk storage
// Vercel has read-only filesystem, so we can't create upload folders
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME

/**
 * Configure where and how to store uploaded files
 */
const storage = isServerless
    ? multer.memoryStorage() // Use memory in serverless
    : multer.diskStorage({
        destination: function (req, file, cb) {
            // Create uploads directory if it doesn't exist (local only)
            const uploadsDir = path.join(__dirname, '../uploads/temp')
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true })
            }
            cb(null, uploadsDir)
        },
        filename: function (req, file, cb) {
            // Generate unique filename: productimage_timestamp_randomnumber.jpg
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, 'productimage_' + uniqueSuffix + path.extname(file.originalname))
        }
    })

/**
 * File filter - only allow images
 */
const fileFilter = (req, file, cb) => {
    // Accept only image files
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'))
    }
}

/**
 * Create multer upload middleware
 */
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5MB max file size
    },
    fileFilter: fileFilter
})

module.exports = upload
