  //Check every rerequest before it reaches the protected route

  const {verifyAccessToken} = require('../utils/jwt')
  const User = require('../models/User')


  //check if user is logged in (has valid access token)
  const loginCheck = async (req , res, next) =>{
      try{
          const token = req.get('Authorization')?.replace('Bearer ', '')
          if (!token) {
              return res.status(401).json({
                  success: false,
                  message: 'No token provided'
              })
          }
          //verify access token
          const decoded = verifyAccessToken(token)
          const user = await User.findById(decoded.userId).select('-password') //if not select -password -> show everything including password, '-' to exclude the hashed part
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

  //check if user is admin
  const isAdmin = (req, res, next) => {
      if (req.user && req.user.role === 'admin') {
          next()
      } else {
          return res.status(403).json({
              success: false,
              message: 'Access denied. Admin role required.'
          })
      }
  }

  module.exports = {
      loginCheck,
      isAuth,
      isAdmin
  }