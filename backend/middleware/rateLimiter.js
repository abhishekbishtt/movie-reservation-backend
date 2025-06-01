const rateLimit = require('express-rate-limit');

// General API rate limiter
// Allows 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Stricter limiter for auth routes
// Allows 5 login attempts per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Limiter for password reset
// Allows 3 reset requests per hour per IP
const resetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: 'Too many password reset attempts. Please try again after 1 hour.'
    }
});

// Limiter for booking
// Prevents ticket scalping
const bookingLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many booking attempts. Please slow down.'
    }
});

module.exports = {
    apiLimiter,
    authLimiter,
    resetPasswordLimiter,
    bookingLimiter
};
