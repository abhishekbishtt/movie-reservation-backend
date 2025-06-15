const Joi = require('joi');

// Create booking
const createBookingSchema = Joi.object({
    showtimeId: Joi.string()
        .required()
        .messages({
            'any.required': 'Showtime ID is required'
        }),

    selectedSeats: Joi.array()
        .items(Joi.string())
        .min(1)
        .max(10)
        .required()
        .messages({
            'array.min': 'Please select at least one seat',
            'array.max': 'Maximum 10 seats allowed per booking',
            'any.required': 'Selected seats are required'
        })
});

// Reserve seats temporarily
const reserveSeatsSchema = Joi.object({
    seatIds: Joi.array()
        .items(Joi.string())
        .min(1)
        .max(10)
        .required()
        .messages({
            'array.min': 'Please select at least one seat',
            'array.max': 'Maximum 10 seats allowed'
        })
});

// Cancel booking
const cancelBookingSchema = Joi.object({
    reason: Joi.string()
        .max(500)
        .optional()
});

// Booking ID param
const bookingIdSchema = Joi.object({
    bookingId: Joi.string()
        .required()
});

// Showtime ID param
const showtimeIdSchema = Joi.object({
    showtimeId: Joi.string()
        .required()
});

module.exports = {
    createBookingSchema,
    reserveSeatsSchema,
    cancelBookingSchema,
    bookingIdSchema,
    showtimeIdSchema
};
