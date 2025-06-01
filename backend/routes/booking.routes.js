const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/booking.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { validate, validateParams } = require('../middleware/validate');
const { bookingLimiter } = require('../middleware/rateLimiter');
const {
    createBookingSchema,
    cancelBookingSchema,
    bookingIdSchema
} = require('../validations');


// All booking routes require authentication
router.use(verifyToken);

// Create new booking
router.post('/',
    bookingLimiter,
    validate(createBookingSchema),
    bookingController.createBooking
);

// Get my bookings
router.get('/me',
    bookingController.getMyBookings
);

// Get specific booking
router.get('/:bookingId',
    validateParams(bookingIdSchema),
    bookingController.getBookingById
);

// Cancel booking
router.patch('/:bookingId/cancel',
    validateParams(bookingIdSchema),
    validate(cancelBookingSchema),
    bookingController.cancelBooking
);

// Admin: Get user bookings
router.get('/user/:userId',
    isAdmin,
    bookingController.getUserBookings
);


module.exports = router;
