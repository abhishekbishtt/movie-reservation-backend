import api from './api';

export const bookingService = {
    // Create a new booking (requires auth)
    createBooking: async (bookingData) => {
        // bookingData: { showtimeId, selectedSeats: ['A1', 'A2'] }
        const response = await api.post('/booking', bookingData);
        return response.data;
    },

    // Get current user's bookings
    getMyBookings: async () => {
        const response = await api.get('/booking/me');
        return response.data;
    },

    // Get specific booking details
    getBookingById: async (bookingId) => {
        const response = await api.get(`/booking/${bookingId}`);
        return response.data;
    },

    // Cancel a booking
    cancelBooking: async (bookingId, reason = '') => {
        const response = await api.patch(`/booking/${bookingId}/cancel`, {
            reason,
        });
        return response.data;
    },
};
