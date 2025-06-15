const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');

const path = require('path');

dotenv.config();

const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON body
app.use(express.json({ limit: '10kb' }));

// Rate limiting for all API routes
app.use('/api', apiLimiter);


// Import routes
const authRoutes = require('./routes/auth.routes');
const movieRoutes = require('./routes/movie.routes');
const showtimeRoutes = require('./routes/showtime.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const healthRoutes = require('./routes/health.routes');
const searchRoutes = require('./routes/search.routes');
const adminRoutes = require('./routes/admin.routes');
const profileRoutes = require('./routes/profile.routes');


// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/showtime', showtimeRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);


// Health check
app.get('/ping', (req, res) => {
    res.send('pong');
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler - must be last
app.use(errorHandler);


// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log(`Server running on port ${PORT}`);
        console.log('Database connected successfully');

        const SchedulerService = require('./services/scheduler.service');
        SchedulerService.start();

    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1);
    }
});
