const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const BlackListedTokens = sequelize.define('BlacklistedToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true

    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'blacklisted_tokens',


});
module.exports = { BlackListedTokens };