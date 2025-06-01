const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profile.controller');
const { verifyToken } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
    updateProfileSchema,
    deactivateAccountSchema
} = require('../validations');


// All profile routes require authentication
router.use(verifyToken);

// Get my profile
router.get('/',
    profileController.getUserProfile
);

// Update my profile
router.put('/',
    validate(updateProfileSchema),
    profileController.updateUserProfile
);

// Deactivate my account
router.put('/deactivate',
    validate(deactivateAccountSchema),
    profileController.deactivateAccount
);


module.exports = router;
