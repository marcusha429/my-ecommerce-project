// NOTE: express-rate-limit doesn't work well in serverless (state is lost between invocations)
// For production serverless, consider using Vercel's built-in rate limiting or a service like Upstash Redis
// For now, these are no-op middlewares that just pass through

const createNoOpRateLimit = (name) => (req, res, next) => {
    // In serverless, we skip rate limiting
    // TODO: Implement serverless-compatible rate limiting with Redis/Upstash
    console.log(`[${name}] Rate limiting skipped in serverless mode`)
    next()
}

const signinRateLimit = createNoOpRateLimit('signin')
const signupRateLimit = createNoOpRateLimit('signup')
const refreshTokenRateLimit = createNoOpRateLimit('refresh-token')
const generalApiRateLimit = createNoOpRateLimit('general-api')

module.exports = {
    signinRateLimit,
    signupRateLimit,
    refreshTokenRateLimit,
    generalApiRateLimit
}