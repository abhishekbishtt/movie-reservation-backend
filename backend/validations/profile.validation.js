const Joi = require('joi');

// Update profile
const updateProfileSchema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(50)
        .optional(),

    lastName: Joi.string()
        .min(2)
        .max(50)
        .optional(),

    phone: Joi.string()
        .pattern(/^[+]?[\d\s-]{10,15}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number'
        }),

    currentPassword: Joi.string()
        .optional(),

    newPassword: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .optional()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must have uppercase, lowercase, and number'
        })
})
    .with('newPassword', 'currentPassword');

// Deactivate account
const deactivateAccountSchema = Joi.object({
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required to deactivate account'
        }),

    reason: Joi.string()
        .max(500)
        .optional()
});

module.exports = {
    updateProfileSchema,
    deactivateAccountSchema
};
