// Global error handler - catches all errors in one place
const errorHandler = (err, req, res, next) => {

    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';
    let errors = err.errors || null;

    // Handle Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = 'Validation failed';
        errors = err.errors.map(e => ({
            field: e.path,
            message: e.message
        }));
    }

    // Handle Sequelize unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Duplicate entry';
        errors = err.errors.map(e => ({
            field: e.path,
            message: `${e.path} already exists`
        }));
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Handle Joi validation errors
    if (err.isJoi) {
        statusCode = 400;
        message = 'Validation failed';
        errors = err.details.map(d => ({
            field: d.path.join('.'),
            message: d.message.replace(/"/g, '')
        }));
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    // Send response
    const response = {
        success: false,
        message: message
    };

    if (errors) {
        response.errors = errors;
    }

    // Include stack trace in development only
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
