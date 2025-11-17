const express = require('express')
const router = express.Router()
const { isAuth } = require('../middleware/auth')
const { getCart, addToCart, updateCart, removeFromCart, clearCart } = require('../controllers/cart')

router.get('/', isAuth, getCart)
router.post('/add', isAuth, addToCart)
router.put('/update', isAuth, updateCart)
router.delete('/remove/:productId', isAuth, removeFromCart)
router.delete('/clear', isAuth, clearCart)

module.exports = router