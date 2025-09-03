//Check every rerequest before it reaches the protected route

const {verifyAccessToken} = require('../utils/jwt')
const User = require('../models/user')


//check if user is logged in (has valid access token)
const loginCheck = async (res , res, next) =>{
    try{
        const token = req.headers('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return res.status(401).json({
                success: false,
                messaghe: 'No token provided'
            })
        }
        //verify access token
        const decoded = verifyAccessToken(token)
        const user = await User.findById(decoded.uderId).select('-password')
        if (!user){
            return res.status(401).json({
                success: false,
                message: "Token is not valid"
            })
        }
        //if user found -> add user to request
        req.user = user
        next()
    }catch(error){
        return res.status(401).json({
            success: false,
            message: "Token is not valid"
        })
    }
}
//check if user is authenticated (alias for loginCheck)
const isAuth = loginCheck

module.exports = {
    loginCheck,
    isAuth
}