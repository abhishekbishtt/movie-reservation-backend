const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city.controller');

// Public route to get all active cities
router.get('/', cityController.getAllCities);

module.exports = router;
