// Quick DB test with 5 second timeout
const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('Testing database connection...');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        pool: { max: 1, acquire: 5000, idle: 1000 },
        logging: false
    }
);

// 5 second timeout
const timeout = setTimeout(() => {
    console.log('❌ TIMEOUT: PostgreSQL is not responding. Is it running?');
    console.log('Run: brew services start postgresql');
    process.exit(1);
}, 5000);

sequelize.authenticate()
    .then(() => {
        clearTimeout(timeout);
        console.log('✅ Database connected successfully!');
        process.exit(0);
    })
    .catch(err => {
        clearTimeout(timeout);
        console.log('❌ Connection failed:', err.message);
        process.exit(1);
    });
