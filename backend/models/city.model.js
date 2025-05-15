// =============================================================================
// CITY MODEL - Represents cities where theaters operate
// =============================================================================
// 
// WHY WE NEED THIS:
// - Users search for movies by city
// - Theaters belong to a specific city
// - Helps in filtering and organizing theater data
//
// RELATIONSHIPS:
// - One City HAS MANY Theaters (e.g., Mumbai has multiple PVR theaters)
// =============================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

// Define the City model
// Think of this as creating a "blueprint" for how city data is stored
const City = sequelize.define('City', {

    // Primary key - unique identifier for each city
    id: {
        type: DataTypes.INTEGER,  // Using integer for city IDs (auto-increment)
        primaryKey: true,
        autoIncrement: true       // Database automatically assigns 1, 2, 3, etc.
    },

    // City name - e.g., "Mumbai", "Delhi", "Bangalore"
    name: {
        type: DataTypes.STRING(100),  // Max 100 characters
        allowNull: false,             // Required field - can't be empty
        validate: {
            notEmpty: true,             // Also can't be an empty string ""
            len: [2, 100]               // Must be between 2-100 characters
        }
    },

    // State - e.g., "Maharashtra", "Karnataka"
    state: {
        type: DataTypes.STRING(100),
        allowNull: true               // Optional field
    },

    // Is this city currently active in our system?
    // Useful for temporarily disabling service in a city
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true            // Cities are active by default
    }

}, {
    // Model options
    tableName: 'cities',     // Actual table name in database (lowercase, plural)
    timestamps: true,        // Adds createdAt and updatedAt automatically

    // Database indexes for faster searches
    indexes: [
        {
            fields: ['name']     // Index on name for quick city lookups
        },
        {
            fields: ['is_active'] // Index for filtering active cities
        }
    ]
});

console.log('🏙️ City model defined successfully.');

// Export as an object for consistency with other models
module.exports = { City };
