const express = require('express')
const Router = express.Router()
const aiController = require('../controllers/ai')
const { isAuth } = require('../middleware/auth')

// All AI routes require authentication
Router.post('/chat', isAuth, aiController.chat)
Router.post('/analyze-cart', isAuth, aiController.analyzeCart)
Router.post('/check-recipe', isAuth, aiController.checkRecipe)

module.exports = Router
