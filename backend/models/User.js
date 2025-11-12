const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema(
    //name, email, password
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, //no duplicate emails in database
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer'
        },
        //AI Chat History
        chatHistory: [
            {
                role: {
                    type: String,
                    enum: ['user', 'assistant'],
                    required: true
                },
                content: {
                    type: String,
                    required: true
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        //Health Preference
        healthProfile: {
            condition: [String], //['diabetes, 'hypertension']
            allergies: [String],
            dietaryPreferences: [String], //['vegetarian', 'low-carb']
            goals: [String]
        }
    }
)

//hash password before saving to database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

//compare hashed password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)



