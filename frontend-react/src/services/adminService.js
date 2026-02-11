import api from './api';

export const adminService = {
    // ========== USERS ==========
    getAllUsers: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/admin/users?${params}`);
        return response.data;
    },

    getUserById: async (userId) => {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    },

    // ========== MOVIES ==========
    createMovie: async (movieData) => {
        const response = await api.post('/admin/movies', movieData);
        return response.data;
    },

    updateMovie: async (movieId, movieData) => {
        const response = await api.put(`/admin/movies/${movieId}`, movieData);
        return response.data;
    },

    deleteMovie: async (movieId) => {
        const response = await api.delete(`/admin/movies/${movieId}`);
        return response.data;
    },

    // ========== SHOWTIMES ==========
    createShowtime: async (showtimeData) => {
        const response = await api.post('/admin/showtimes', showtimeData);
        return response.data;
    },

    updateShowtime: async (showtimeId, showtimeData) => {
        const response = await api.put(`/admin/showtimes/${showtimeId}`, showtimeData);
        return response.data;
    },

    deleteShowtime: async (showtimeId) => {
        const response = await api.delete(`/admin/showtimes/${showtimeId}`);
        return response.data;
    },

    getShowtimeBookings: async (showtimeId) => {
        const response = await api.get(`/admin/showtimes/${showtimeId}/bookings`);
        return response.data;
    },

    // ========== BOOKINGS ==========
    getAllBookings: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/admin/bookings?${params}`);
        return response.data;
    },

    getBookingById: async (bookingId) => {
        const response = await api.get(`/admin/bookings/${bookingId}`);
        return response.data;
    },

    // ========== PAYMENTS ==========
    getAllPayments: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/admin/payments?${params}`);
        return response.data;
    },

    refundPayment: async (paymentId, reason) => {
        const response = await api.post(`/payment/${paymentId}/refund`, { reason });
        return response.data;
    },

    // ========== ANALYTICS ==========
    getRevenue: async (period = 'weekly') => {
        const response = await api.get(`/admin/analytics/revenue?period=${period}`);
        return response.data;
    },

    getOccupancy: async () => {
        const response = await api.get('/admin/analytics/occupancy');
        return response.data;
    },

    // ========== HALLS ==========
    getAllHalls: async () => {
        const response = await api.get('/admin/halls');
        return response.data;
    },

    updateHall: async (hallId, hallData) => {
        const response = await api.put(`/admin/halls/${hallId}`, hallData);
        return response.data;
    },
};
