// =============================================================================
// PROFILE CONTROLLER - Handles user profile operations
// =============================================================================
//
// WHAT THIS CONTROLLER DOES:
// - Get current user's profile
// - Update profile information
// - Deactivate account (soft delete)
//
// NOTE: We use soft delete (deactivate) instead of hard delete because:
// - User might want to reactivate their account
// - We need to keep booking/payment history for records
// - Legal/compliance requirements may require data retention
// =============================================================================

const { User, Reservation, Payment } = require('../models');
const bcrypt = require('bcrypt');


// =============================================================================
// GET USER PROFILE
// =============================================================================
// GET /api/profile
// 
// Returns the logged-in user's profile information

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user with some stats
        const user = await User.findByPk(userId, {
            // Exclude sensitive fields
            attributes: {
                exclude: ['password', 'reset_token', 'reset_token_expiry']
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get some stats for the profile page
        const totalBookings = await Reservation.count({
            where: { user_id: userId }
        });

        const confirmedBookings = await Reservation.count({
            where: {
                user_id: userId,
                status: 'confirmed'
            }
        });

        res.status(200).json({
            success: true,
            profile: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive,
                lastLogin: user.lastLogin,
                memberSince: user.createdAt
            },
            stats: {
                totalBookings,
                confirmedBookings
            }
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
};


// =============================================================================
// UPDATE USER PROFILE
// =============================================================================
// PUT /api/profile
// Body: { firstName, lastName, phone, currentPassword, newPassword }
//
// Updates user's profile information
// If changing password, currentPassword is required for verification

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            firstName,
            lastName,
            phone,
            currentPassword,
            newPassword
        } = req.body;

        // Fetch user
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Build update object with only provided fields
        const updateData = {};

        // Update basic info if provided
        if (firstName !== undefined) {
            // Validate first name
            if (firstName.length < 2 || firstName.length > 50) {
                return res.status(400).json({
                    success: false,
                    message: 'First name must be between 2 and 50 characters'
                });
            }
            updateData.firstName = firstName;
        }

        if (lastName !== undefined) {
            if (lastName.length < 2 || lastName.length > 50) {
                return res.status(400).json({
                    success: false,
                    message: 'Last name must be between 2 and 50 characters'
                });
            }
            updateData.lastName = lastName;
        }

        if (phone !== undefined) {
            // Basic phone validation (can be more strict based on region)
            const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
            if (phone && !phoneRegex.test(phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please enter a valid phone number'
                });
            }
            updateData.phone = phone;
        }

        // Handle password change
        if (newPassword) {
            // Current password is required to change password
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is required to set a new password'
                });
            }

            // Verify current password
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Validate new password
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                return res.status(400).json({
                    success: false,
                    message: 'New password must be at least 8 characters with uppercase, lowercase, and number'
                });
            }

            // Hash new password
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(newPassword, saltRounds);
        }

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        // Update the user
        await user.update(updateData);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profile: {
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                // Don't send password-related info
            }
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
};


// =============================================================================
// DEACTIVATE ACCOUNT
// =============================================================================
// PUT /api/profile/deactivate
// Body: { password, reason }
//
// Deactivates user account (soft delete)
// User can potentially reactivate by contacting support

exports.deactivateAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password, reason } = req.body;

        // Password required for account deactivation (security measure)
        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required to deactivate account'
            });
        }

        // Fetch user
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password'
            });
        }

        // Check for upcoming confirmed bookings
        const upcomingBookings = await Reservation.count({
            where: {
                user_id: userId,
                status: 'confirmed'
                // In production, also check if showtime is in the future
            }
        });

        if (upcomingBookings > 0) {
            return res.status(400).json({
                success: false,
                message: `You have ${upcomingBookings} upcoming booking(s). Please cancel them before deactivating your account.`
            });
        }

        // Deactivate the account
        await user.update({
            isActive: false
            // Optionally store deactivation reason for analytics
        });

        console.log(`Account deactivated: ${user.email}, Reason: ${reason || 'Not specified'}`);

        res.status(200).json({
            success: true,
            message: 'Account deactivated successfully. We\'re sorry to see you go!'
        });

    } catch (error) {
        console.error('Error deactivating account:', error);
        res.status(500).json({
            success: false,
            message: 'Error deactivating account'
        });
    }
};
