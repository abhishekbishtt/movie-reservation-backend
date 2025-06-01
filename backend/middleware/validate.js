// Middleware to validate request body using Joi schema
const validate = (schema) => {
    return (req, res, next) => {

        // Validate request body against schema
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        // If validation failed, pass error to error handler
        if (error) {
            error.isJoi = true;
            return next(error);
        }

        // Replace body with validated and sanitized data
        req.body = value;

        next();
    };
};

// Middleware to validate query parameters
const validateQuery = (schema) => {
    return (req, res, next) => {

        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            error.isJoi = true;
            return next(error);
        }

        req.query = value;

        next();
    };
};

// Middleware to validate route parameters
const validateParams = (schema) => {
    return (req, res, next) => {

        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            error.isJoi = true;
            return next(error);
        }

        req.params = value;

        next();
    };
};

module.exports = {
    validate,
    validateQuery,
    validateParams
};
