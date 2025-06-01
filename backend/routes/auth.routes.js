const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { authLimiter, resetPasswordLimiter } = require('../middleware/rateLimiter');
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require('../validations');



router.post('/register',
    validate(registerSchema),
    authController.register
);

router.post('/login',
    authLimiter,
    validate(loginSchema),
    authController.login
);

router.post('/forgot-password',
    resetPasswordLimiter,
    validate(forgotPasswordSchema),
    authController.forgotPassword
);

router.post('/reset-password',
    validate(resetPasswordSchema),
    authController.resetPassword
);


router.post('/logout',
    verifyToken,
    authController.logout
);

router.post('/refresh-token',
    authController.refreshToken
);

// Email verification routes
router.post('/verify-email',
    authController.verifyEmail
);

router.post('/resend-verification',
    authController.resendVerification
);


module.exports = router;
