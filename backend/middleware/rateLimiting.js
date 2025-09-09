const rateLimit = require('express-rate-limit')

//limit login attempts (prevent brute-force)
const signinRateLimit = rateLimit({
    windowMs: 15*60*1000, //15m
    max: 5, //5 attemps
    message: {
        success: false,
        message: "Too many login attempts from this IP, please try again after 15 minutes"
    },
    standardHeaders: true, //return rate limit info in RateLimit-* headers
    legacyHeaders: false, //Disable X-RateLimit-* headers
    skipSuccessfulRequests: true, //don't count successful requests
})

//limit signup attemps (prevent spam accounts)
const signupRateLimit = rateLimit({
    windowMs: 60*60*1000, //1 hour
    max: 3, //3 signup attemps
    message: {
        success: false,
        message: "Too many signup attempts from this IP, please try again after an hour"
    },
    standardHeaders: true,
    legacyHeaders: false,
})

//rate limit for password for refresh token requests 
const refreshTokenRateLimit = rateLimit({
    windowMs: 15*60*1000, //15m
    max: 10, //10 refresh attemps per IP per window
    message:{
        success: false,
        message: "Too many token requests from this IP, please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false,
})

//general API rate limit (API protection)
const generalApiRateLimit = rateLimit({
    windowMs: 15*60*1000, //15m
    max: 100,   //100 requests per IP per window
    message:{
        success: false,
        message: "Too many requests from this IP, please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = {
    signinRateLimit,
    signupRateLimit,
    refreshTokenRateLimit,
    generalApiRateLimit
}