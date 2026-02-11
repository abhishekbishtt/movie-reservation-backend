const express = require('express');
const router = express.Router();
const theaterController = require('../controllers/theater.controller');

// Public routes for theaters

// List all theaters in a city
router.get('/city/:cityId', theaterController.getTheatersByCity);

// List theaters showing a specific movie in a city (with showtimes)
router.get('/movie/:movieId/city/:cityId', theaterController.getMovieTheatersInCity);

// Get detailed theater information
router.get('/:theaterId', theaterController.getTheaterById);

module.exports = router;
