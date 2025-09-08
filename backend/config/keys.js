const config = {
    JWT_ACCESS_SECRET:process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 5000
}

//validate all environment
for (const [key,value] of Object.entries(config)){
    if (!value && key !== 'PORT'){ //skip PORT check since it has a default value
        throw new Error(`${key} is required`)
    }
}

module.exports = config