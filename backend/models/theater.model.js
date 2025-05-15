// =============================================================================
// THEATER MODEL - Represents movie theaters/cinema halls
// =============================================================================
// 
// WHY WE NEED THIS:
// - Theaters are physical locations where movies are shown
// - Each theater has multiple halls (screens)
// - Users select a theater based on their city and preferences
//
// RELATIONSHIPS:
// - One Theater BELONGS TO one City
// - One Theater HAS MANY Halls
// =============================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

// Define the Theater model
const Theater = sequelize.define('Theater', {

    // Primary key - unique identifier for each theater
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // Theater name - e.g., "PVR Phoenix", "INOX Nariman Point"
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 200]
        }
    },

    // Full address of the theater
    address: {
        type: DataTypes.TEXT,         // TEXT allows longer content than STRING
        allowNull: false
    },

    // Foreign key - which city does this theater belong to?
    // This creates a relationship with the City model
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cities',            // References the 'cities' table
            key: 'id'                   // Links to the 'id' column in cities
        },
        onDelete: 'RESTRICT',         // Prevent deleting city if theaters exist
        onUpdate: 'CASCADE'           // If city ID changes, update here too
    },

    // Does this theater have IMAX screens?
    imax_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    // Does this theater have 4DX screens?
    four_dx_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    // Contact phone number (optional)
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },

    // Operating status
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }

}, {
    tableName: 'theaters',
    timestamps: true,

    indexes: [
        {
            fields: ['city_id']        // Quick lookup by city
        },
        {
            fields: ['is_active']
        },
        {
            fields: ['imax_available']
        }
    ]
});

console.log('🎭 Theater model defined successfully.');

module.exports = { Theater };
