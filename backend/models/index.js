'use strict';

const { sequelize } = require('./db');

console.log('🔄 Loading all models...');

// User & Authentication
const { User } = require('./user.model');
const { BlackListedTokens } = require('./blackListedToken.model');

// Movie & Showtime
const { Movie } = require('./movie.model');
const { Showtime } = require('./showtime.model');

// Location (City → Theater → Hall → Seat)
const { City } = require('./city.model');
const { Theater } = require('./theater.model');
const { Hall } = require('./hall.model');
const { Seat } = require('./seat.model');

// Booking & Payment
const { Reservation } = require('./reservation.model');
const { Payment } = require('./payment.model');
const { BookedSeats } = require('./booked-seats.model');

console.log('✅ All models loaded successfully');

console.log('🔗 Setting up model associations...');
require('./association');
console.log('✅ All associations configured');

const models = {
  // Database connection
  sequelize,

  // Sequelize library (for Op, DataTypes, etc.)
  Sequelize: require('sequelize'),

  // User-related models
  User,
  BlackListedTokens,

  // Movie-related models
  Movie,
  Showtime,

  // Location-related models
  City,
  Theater,
  Hall,
  Seat,

  // Booking-related models
  Reservation,
  Payment,
  BookedSeats
};

if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development mode - checking database sync...');

  sequelize.sync({ alter: true })
    .then(() => {
      console.log('✅ Database synchronized successfully');
    })
    .catch((error) => {
      console.error('❌ Database sync failed:', error.message);
    });
}

// Export all models as a bundle
module.exports = models;
