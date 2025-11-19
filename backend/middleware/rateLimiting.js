// NOTE: In serverless, state is lost between different function instances
// This provides basic per-instance rate limiting (better than nothing)
// For production, consider Vercel Firewall, Upstash Redis, or Cloudflare rate limiting

// Simple in-memory rate limiting (per serverless instance)
const rateLimitStore = new Map()

const createSimpleRateLimit = (name, windowMs, maxAttempts) => {
    return (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const key = `${name}:${ip}`
        const now = Date.now()

        const record = rateLimitStore.get(key)

        if (!record) {
            rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
            return next()
        }

        if (now > record.resetTime) {
            rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
            return next()
        }

        if (record.count >= maxAttempts) {
            return res.status(429).json({
                success: false,
                message: `Too many ${name} attempts. Please try again later.`
            })
        }

        record.count++
        return next()
    }
}

// Clean up old entries every 15 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
        if (now > record.resetTime) {
            rateLimitStore.delete(key)
        }
    }
}, 15 * 60 * 1000)

const signinRateLimit = createSimpleRateLimit('signin', 15 * 60 * 1000, 5) // 5 attempts per 15 min
const signupRateLimit = createSimpleRateLimit('signup', 60 * 60 * 1000, 3) // 3 attempts per hour
const refreshTokenRateLimit = createSimpleRateLimit('refresh-token', 15 * 60 * 1000, 10) // 10 per 15 min
const generalApiRateLimit = createSimpleRateLimit('general-api', 15 * 60 * 1000, 100) // 100 per 15 min

module.exports = {
    signinRateLimit,
    signupRateLimit,
    refreshTokenRateLimit,
    generalApiRateLimit
}