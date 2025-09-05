const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')

//generate 15min token
const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '15m',
    })
}

//generate 7 days refresh token
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    })
}

//verify access token
const verifyAccessToken = (token) =>{
    return jwt.verify(token, process.env.JWT_SECRET)
}

//verify refresh token
const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}