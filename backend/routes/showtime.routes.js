const express = require('express');
const router = express.Router();

const showtimeController = require('../controllers/showtime.controller');
const { verifyToken } = require('../middleware/auth');
const { validate, validateParams } = require('../middleware/validate');
const { bookingLimiter } = require('../middleware/rateLimiter');
const { reserveSeatsSchema, showtimeIdSchema } = require('../validations');


// Public routes

// Get seat availability
router.get('/:showtimeId/seats',
    showtimeController.getSeatAvailability
);

// Get showtimes for a movie
router.get('/movie/:movieId',
    showtimeController.getShowtimesByMovie
);

// Get showtime details
router.get('/:showtimeId',
    showtimeController.getShowtimeById
);


// Protected routes

// Reserve seats temporarily
router.post('/:showtimeId/reserve',
    verifyToken,
    bookingLimiter,
    validateParams(showtimeIdSchema),
    validate(reserveSeatsSchema),
    showtimeController.reserveSeats
);


module.exports = router;
