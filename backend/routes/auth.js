const express = require('express')
const Router = express.Router()
const authController = require('../controllers/auth')

const {signupValidation, signinValidation, handleValidationErrors} = require('../middleware/validation')

Router.post('/signup', signupValidation, handleValidationErrors, authController.signup)
Router.post('/signin', signinValidation, handleValidationErrors, authController.postSignin)
Router.post('/refresh-token', authController.refreshToken)
Router.post('/logout', authController.logout)

module.exports = Router