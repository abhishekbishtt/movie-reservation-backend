// models/booked-seats.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const BookedSeats = sequelize.define('BookedSeats', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  seat_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  payment_id: {
    type: DataTypes.UUID,
    allowNull: true // null until payment completed
  },
  showtime_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  seat_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  booking_status: {
    type: DataTypes.ENUM('reserved', 'confirmed', 'cancelled'),
    defaultValue: 'reserved'
  },
  reserved_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'booked_seats',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['seat_id', 'showtime_id']
    }
  ]
});
// Export as object for consistent destructuring: const { BookedSeats } = require('./booked-seats.model')
module.exports = { BookedSeats };
