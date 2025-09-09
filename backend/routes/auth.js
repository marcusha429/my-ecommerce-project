const express = require('express')
const Router = express.Router()
const authController = require('../controllers/auth')

const {signupValidation, signinValidation, handleValidationErrors} = require('../middleware/validation')

const {signinRateLimit, signupRateLimit, refreshTokenRateLimit} = require('../middleware/rateLimiting')

Router.post('/signup', signupRateLimit, signupValidation, handleValidationErrors, authController.signup)
Router.post('/signin', signinRateLimit, signinValidation, handleValidationErrors, authController.postSignin)
Router.post('/refresh-token', refreshTokenRateLimit, authController.refreshToken)
Router.post('/logout', authController.logout)


module.exports = Router