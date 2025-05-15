// =============================================================================
// RESERVATION MODEL - Represents a user's booking/reservation
// =============================================================================
// 
// WHY WE NEED THIS:
// - When a user books seats, we create a reservation
// - Tracks which user booked which seats for which showtime
// - Manages booking lifecycle: pending → confirmed/cancelled
//
// BOOKING FLOW:
// 1. User selects seats → Reservation created with status 'pending'
// 2. User pays → Payment created, reservation becomes 'confirmed'
// 3. User cancels → Reservation becomes 'cancelled', refund processed
//
// RELATIONSHIPS:
// - One Reservation BELONGS TO one User
// - One Reservation BELONGS TO one Showtime
// - One Reservation HAS ONE Payment
// =============================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

// Define the Reservation model
const Reservation = sequelize.define('Reservation', {

    // Primary key - using UUID for unique booking IDs
    // UUID looks like: "550e8400-e29b-41d4-a716-446655440000"
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,  // Automatically generate UUID
        primaryKey: true
    },

    // Foreign key - which user made this reservation?
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',    // If user is deleted, delete their reservations
        onUpdate: 'CASCADE'
    },

    // Foreign key - which showtime is this reservation for?
    showtime_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'showtimes',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },

    // Selected seats - stored as JSON array
    // Example: ["A1", "A2", "A3"] or [{"row": 1, "seat": 5}, {"row": 1, "seat": 6}]
    selected_seats: {
        type: DataTypes.JSONB,    // JSONB is faster for PostgreSQL queries
        allowNull: false,
        defaultValue: []
    },

    // Number of seats booked (calculated from selected_seats for easy querying)
    seat_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,                 // Must book at least 1 seat
            max: 10                 // Limit to prevent bulk booking abuse
        }
    },

    // Total amount for this reservation (in INR)
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),   // Up to 10 digits, 2 decimal places
        allowNull: false,                  // Example: 999.99
        validate: {
            min: 0
        }
    },

    // Booking status - tracks the reservation lifecycle
    status: {
        type: DataTypes.ENUM(
            'pending',      // User selected seats, payment not yet done
            'confirmed',    // Payment successful, booking confirmed
            'cancelled',    // User or admin cancelled the booking
            'expired'       // User didn't complete payment in time
        ),
        allowNull: false,
        defaultValue: 'pending'
    },

    // Convenience fee charged (e.g., platform fee per ticket)
    convenience_fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },

    // When was the booking confirmed? (null if not confirmed)
    confirmed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },

    // When does the pending reservation expire?
    // Typically 10-15 minutes after seat selection
    expires_at: {
        type: DataTypes.DATE,
        allowNull: true
    },

    // Cancellation reason (if cancelled)
    cancellation_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    // Who cancelled? (user or admin)
    cancelled_by: {
        type: DataTypes.ENUM('user', 'admin', 'system'),
        allowNull: true
    }

}, {
    tableName: 'reservations',
    timestamps: true,         // Adds createdAt, updatedAt

    // Indexes for common query patterns
    indexes: [
        {
            fields: ['user_id']             // Find all reservations by user
        },
        {
            fields: ['showtime_id']         // Find all reservations for a showtime
        },
        {
            fields: ['status']              // Filter by status
        },
        {
            fields: ['expires_at']          // Find expired reservations
        },
        {
            // Composite index for finding user's pending reservations quickly
            fields: ['user_id', 'status']
        }
    ],

    // Hooks are functions that run automatically at certain times
    hooks: {
        // Before creating a reservation, set expiration time
        beforeCreate: (reservation) => {
            if (reservation.status === 'pending' && !reservation.expires_at) {
                // Pending reservations expire in 10 minutes
                reservation.expires_at = new Date(Date.now() + 10 * 60 * 1000);
            }
        }
    }
});

console.log('📋 Reservation model defined successfully.');

module.exports = { Reservation };
