

// Import all models
const { User } = require('./user.model');
const { Movie } = require('./movie.model');
const { City } = require('./city.model');
const { Theater } = require('./theater.model');
const { Hall } = require('./hall.model');
const { Seat } = require('./seat.model');
const { Showtime } = require('./showtime.model');
const { Reservation } = require('./reservation.model');
const { Payment } = require('./payment.model');
const { BookedSeats } = require('./booked-seats.model');





City.hasMany(Theater, {
  foreignKey: 'city_id',
  as: 'theaters'
});
Theater.belongsTo(City, {
  foreignKey: 'city_id',
  as: 'city'
});


Theater.hasMany(Hall, {
  foreignKey: 'theater_id',
  as: 'halls'
});
Hall.belongsTo(Theater, {
  foreignKey: 'theater_id',
  as: 'theater'
});


Hall.hasMany(Seat, {
  foreignKey: 'hall_id',
  as: 'seats'
});
Seat.belongsTo(Hall, {
  foreignKey: 'hall_id',
  as: 'hall'
});





Movie.hasMany(Showtime, {
  foreignKey: 'movie_id',
  as: 'showtimes'
});
Showtime.belongsTo(Movie, {
  foreignKey: 'movie_id',
  as: 'movie'
});


Hall.hasMany(Showtime, {
  foreignKey: 'hall_id',
  as: 'showtimes'
});
Showtime.belongsTo(Hall, {
  foreignKey: 'hall_id',
  as: 'hall'
});





User.hasMany(Reservation, {
  foreignKey: 'user_id',
  as: 'reservations'
});
Reservation.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});


Showtime.hasMany(Reservation, {
  foreignKey: 'showtime_id',
  as: 'reservations'
});
Reservation.belongsTo(Showtime, {
  foreignKey: 'showtime_id',
  as: 'showtime'
});





User.hasMany(Payment, {
  foreignKey: 'user_id',
  as: 'payments'
});
Payment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});


Reservation.hasOne(Payment, {
  foreignKey: 'reservation_id',
  as: 'payment'
});
Payment.belongsTo(Reservation, {
  foreignKey: 'reservation_id',
  as: 'reservation'
});





Payment.hasMany(BookedSeats, {
  foreignKey: 'payment_id',
  as: 'bookedSeats'
});
BookedSeats.belongsTo(Payment, {
  foreignKey: 'payment_id',
  as: 'payment'
});


Seat.hasMany(BookedSeats, {
  foreignKey: 'seat_id',
  as: 'bookings'
});
BookedSeats.belongsTo(Seat, {
  foreignKey: 'seat_id',
  as: 'seat'
});


Showtime.hasMany(BookedSeats, {
  foreignKey: 'showtime_id',
  as: 'bookedSeats'
});
BookedSeats.belongsTo(Showtime, {
  foreignKey: 'showtime_id',
  as: 'showtime'
});




module.exports = {
  User,
  Movie,
  City,
  Theater,
  Hall,
  Seat,
  Showtime,
  Reservation,
  Payment,
  BookedSeats
};
