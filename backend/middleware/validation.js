//Handle input validation using express-validator
const { body, validationResult } = require('express-validator')

//validation rules for sign up
const signupValidation = [
    //name rules : required field, 3 -> 25 characters, only letters & spaces, trim whitespace
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({min:3, max:25})
        .withMessage('Name must be between 3-25 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces')
        .trim(),
    //email rules : required field, valid email format, normalize to lowercase, trim whitespace
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail()
        .trim(),
    //password rules : required field, 8 -> 128 characters
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({min:8, max:128})
        .withMessage('Password must be between 8-128 characters'),
    //password confirmation rules : required field, must match password field
    body('passwordConfirmation')
        .notEmpty()
        .withMessage('Password confirmation is required')
        .custom((value, {req}) =>{
            if(value != req.body.password){
                throw new Error('Passwords do not match')
            }
            return true
        })
]

//validation rules for sign in
const signinValidation = [
    //email rules : required field, valid email format, trim and normalize
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
        .trim(),
    //password rules : required field, not empty
    body('password')
        .notEmpty()
        .withMessage('Password is required')
]

//function to handle validation errors
const handleValidationErrors = (req, res, next) =>{
    //check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        //format Errors into clean structure
        const formattedErrors = errors.array().reduce((acc, error) =>{
            acc[error.path] = error.msg
            return acc
        }, {})
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: formattedErrors
        })
    }
    next()
}

module.exports = {
    signupValidation,
    signinValidation,
    handleValidationErrors
}