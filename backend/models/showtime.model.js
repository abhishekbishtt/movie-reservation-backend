const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Showtime = sequelize.define('Showtime', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  movie_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hall_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  show_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  show_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  available_seats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'showtimes',
  timestamps: true
});
console.log('🔍 Showtime model defined successfully.');

// Export as object for consistent destructuring: const { Showtime } = require('./showtime.model')
module.exports = { Showtime };