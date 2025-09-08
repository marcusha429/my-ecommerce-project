const User = require('../models/User')
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} = require('../utils/jwt')

class AuthController {
    //User Registration
    async signup(req,res) {
        try{
            const {name, email, password} = req.body

            //check if user existed
            const existingUser = await User.findOne({email})
            if(existingUser){
                return res.status(400).json({
                    success: false,
                    message: "User already exists"
                })
            }
            //create new user
            const user = new User({name, email, password})
            await user.save()

            //generate tokens
            const accessToken = generateAccessToken({userId: user._id})
            const refreshToken = generateRefreshToken({userId: user._id})

            res.status(201).json({
                success: true,
                message: "User created successfully",
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            })
        } catch(error){
            res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            })
        }
    }
    //user log in
    async postSignin(req,res){
        try{
            const {email, password} = req.body

            //find user by email
            const user = await User.findOne({email})
            if(!user){
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                })
            }
            //if email found -> check password
            const isPasswordValid = await user.comparePassword(password)
            if(!isPasswordValid){
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password",
                })
            }
            //if email and password found -> create tokens
            const accessToken = generateAccessToken({userId: user._id})
            const refreshToken = generateRefreshToken({userId: user._id})
            await User.findByIdAndUpdate(user._id, {refreshToken})
                
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, //prevent XSS attack
                secure: process.env.NODE_ENV === 'production', //HTTPS only in production
                sameSite: 'Strict', //CSRF protection
                maxAge: 7*24*60*60*1000 //7 days in ms
            })
            res.status(200).json({
                success: true,
                message: "Login successful",
                accessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            })
        }catch(error){
            res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            })
        }
    }

    async logout(req ,res){
        try{
            const refreshToken = req.cookies.refreshToken

            if (refreshToken){
                //clear refresh token from db
                const decoded = verifyRefreshToken(refreshToken)
                await User.findByIdAndUpdate(decoded.userId, {refreshToken: null})
            }
            //clear refresh token cookie
            res.clearCookie('refreshToken')

            res.json({
                success: true, 
                message: "Logged out successfully"
            })
        }catch(error){
            //if error, clear cookie anyway
            res.clearCookie('refreshToken')
            res.json({
                success: true,
                message: "Logged out successfully"
            })
        }
    }

    //Refresh access token
    async refreshToken(req,res){
        try{
            const refreshToken = req.cookies.refreshToken //read from cookie
            if (!refreshToken){
                return res.status(401).json({
                    success: false, 
                    message: "Refresh token not found in cookies"
                })
            }
            //verify refresh token
            const decoded = verifyRefreshToken(refreshToken)
            const user = await User.findById(decoded.userId)
            if (!user || user.refreshToken != refreshToken){
                return res.status(401).json({
                    success:false,
                    message: "Invalid refresh token"
                })
            }
            //if user found -> generate new access token by refreshToken of userid
            const newAccessToken = generateAccessToken({userId: user._id})
            res.json({
                success: true,
                message: "Access token generated successfully",
                accessToken: newAccessToken
            })
        }catch(error){
            res.staus(401).json({
                success: false,
                message: "Invalid refresh token",
                error: error.message
            })
        }
    }
}

module.exports = new AuthController()