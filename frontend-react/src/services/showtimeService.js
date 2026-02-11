import api from './api';

export const showtimeService = {
    // Get showtimes for a movie (optionally filtered by date)
    getShowtimesByMovie: async (movieId, date = null) => {
        let url = `/showtime/movie/${movieId}`;
        if (date) {
            url += `?date=${date}`;
        }
        const response = await api.get(url);
        return response.data;
    },

    // Get showtime details
    getShowtimeById: async (showtimeId) => {
        const response = await api.get(`/showtime/${showtimeId}`);
        return response.data;
    },

    // Get seat availability for a showtime
    getSeatAvailability: async (showtimeId) => {
        const response = await api.get(`/showtime/${showtimeId}/seats`);
        return response.data;
    },

    // Reserve seats temporarily (requires auth)
    reserveSeats: async (showtimeId, seatIds) => {
        const response = await api.post(`/showtime/${showtimeId}/reserve`, {
            selectedSeats: seatIds,
        });
        return response.data;
    },
};
