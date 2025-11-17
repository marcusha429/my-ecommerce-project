const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const { isAuth, isAdmin } = require('../middleware/auth')
const {
    uploadProductImage,
    uploadMultipleImages,
    deleteProductImage
} = require('../controllers/upload')

/**
 * Image Upload Routes
 * All routes require authentication + admin role
 */

// POST /api/upload/image - Upload single image
router.post(
    '/image',
    isAuth,
    isAdmin,
    upload.single('image'),  // 'image' is the form field name
    uploadProductImage
)

// POST /api/upload/multiple - Upload up to 5 images
router.post(
    '/multiple',
    isAuth,
    isAdmin,
    upload.array('images', 5),  // 'images' field, max 5 files
    uploadMultipleImages
)

// DELETE /api/upload/image/:publicId - Delete image
router.delete(
    '/image/:publicId',
    isAuth,
    isAdmin,
    deleteProductImage
)

module.exports = router
