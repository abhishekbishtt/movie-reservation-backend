const Joi = require('joi');

// Register new user - accepts either 'name' OR 'firstName'/'lastName'
const registerSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name cannot exceed 100 characters',
        }),

    firstName: Joi.string()
        .min(1)
        .max(50)
        .messages({
            'string.min': 'First name must be at least 1 character',
            'string.max': 'First name cannot exceed 50 characters',
        }),

    lastName: Joi.string()
        .min(1)
        .max(50)
        .messages({
            'string.min': 'Last name must be at least 1 character',
            'string.max': 'Last name cannot exceed 50 characters',
        }),

    email: Joi.string()
        .email()
        .required()
        .lowercase()
        .messages({
            'string.email': 'Please provide a valid email',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must have uppercase, lowercase, and number',
            'any.required': 'Password is required'
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .messages({
            'any.only': 'Passwords must match'
        }),

    role: Joi.string()
        .valid('customer', 'admin')
        .default('customer')
}).or('name', 'firstName'); // Require at least one of name or firstName

// Login
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .lowercase(),

    password: Joi.string()
        .required()
});

// Forgot password
const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .lowercase()
});

// Reset password
const resetPasswordSchema = Joi.object({
    token: Joi.string()
        .required()
        .messages({
            'any.required': 'Reset token is required'
        }),

    newPass: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must have uppercase, lowercase, and number'
        })
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
};
