const Joi = require('joi');

// Create payment
const createPaymentSchema = Joi.object({
    reservationId: Joi.string()
        .required()
        .messages({
            'any.required': 'Reservation ID is required'
        })
});

// Confirm payment
const confirmPaymentSchema = Joi.object({
    razorpay_order_id: Joi.string()
        .required(),

    razorpay_payment_id: Joi.string()
        .required(),

    razorpay_signature: Joi.string()
        .required()
});

// Refund payment
const refundPaymentSchema = Joi.object({
    reason: Joi.string()
        .max(500)
        .optional(),

    amount: Joi.number()
        .positive()
        .optional()
});

module.exports = {
    createPaymentSchema,
    confirmPaymentSchema,
    refundPaymentSchema
};
