const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  reservation_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  razorpay_order_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  razorpay_payment_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  razorpay_signature: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('created', 'pending', 'completed', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'created'
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: true
  },
  failure_reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true
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
  tableName: 'payments',
  timestamps: true
});// Export as object for consistent destructuring: const { Payment } = require('./payment.model')
module.exports = { Payment };
