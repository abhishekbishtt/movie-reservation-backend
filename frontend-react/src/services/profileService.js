import api from './api';

export const profileService = {
    // Get current user's profile
    getProfile: async () => {
        const response = await api.get('/profile');
        return response.data;
    },

    // Update profile
    updateProfile: async (profileData) => {
        // profileData: { firstName, lastName, phone, currentPassword, newPassword }
        const response = await api.put('/profile', profileData);
        return response.data;
    },

    // Deactivate account
    deactivateAccount: async (password, reason = '') => {
        const response = await api.put('/profile/deactivate', {
            password,
            reason,
        });
        return response.data;
    },
};
