// Export all validation schemas from one file
module.exports = {
    ...require('./auth.validation'),
    ...require('./booking.validation'),
    ...require('./payment.validation'),
    ...require('./profile.validation')
};
