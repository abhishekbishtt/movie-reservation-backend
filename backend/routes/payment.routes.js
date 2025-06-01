const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { validate, validateParams } = require('../middleware/validate');
const {
    createPaymentSchema,
    confirmPaymentSchema,
    refundPaymentSchema
} = require('../validations');


// Webhook - no auth required (Razorpay calls this)
router.post('/webhook',
    express.raw({ type: 'application/json' }),
    paymentController.handleWebhook
);

// Protected routes
router.use(verifyToken);

// Create payment order
router.post('/',
    validate(createPaymentSchema),
    paymentController.createPayment
);

// Mock payment (dev only)
router.post('/mock',
    paymentController.mockPayment
);

// Get payment history
router.get('/history',
    paymentController.getPaymentHistory
);

// Get payment by ID
router.get('/:paymentId',
    paymentController.getPaymentById
);

// Confirm payment
router.post('/:paymentId/confirm',
    validate(confirmPaymentSchema),
    paymentController.confirmPayment
);

// Admin: Refund payment
router.post('/:paymentId/refund',
    isAdmin,
    validate(refundPaymentSchema),
    paymentController.refundPayment
);


module.exports = router;
