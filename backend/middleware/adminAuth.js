const jwt = require('jsonwebtoken')
const User = require('../models/User')

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            })
        }
        //If token found -> decoded token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

        //After decoded -> find user of token
        const user = await User.findById(decoded.userId)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            })
        }
        //If user found -> check if user is admin ?
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only'
            })
        }

        //If user is admin -> attach with request
        req.user = user
        next() //-> go to the next middleware (route handler)


    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        })
    }
}
module.exports = adminAuth