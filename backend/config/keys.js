const config = {
    JWT_ACCESS_SECRET:process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 5000
}

//validate all environment (only warn in production, don't crash)
for (const [key,value] of Object.entries(config)){
    if (!value && key !== 'PORT'){ //skip PORT check since it has a default value
        if (process.env.NODE_ENV === 'production') {
            console.warn(`⚠️  Warning: ${key} is not set`)
        } else {
            throw new Error(`${key} is required`)
        }
    }
}

module.exports = config