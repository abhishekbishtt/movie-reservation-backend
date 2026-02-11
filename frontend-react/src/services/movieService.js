import api from './api';

export const movieService = {
    // Get all movies with optional filters
    getMovies: async (filters = {}) => {
        // filters: { genre, language, ageRating, page, limit }
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value);
            }
        });
        const response = await api.get(`/movies?${params}`);
        return response.data;
    },

    // Get featured movies for hero section
    getFeaturedMovies: async () => {
        const response = await api.get('/movies/featured');
        return response.data;
    },

    // Search movies
    searchMovies: async (query) => {
        const response = await api.get(`/movies/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Get movie by ID with full details
    getMovieById: async (movieId) => {
        const response = await api.get(`/movies/${movieId}`);
        return response.data;
    },

    // Get trending movies
    getTrendingMovies: async () => {
        const response = await api.get('/movies?trending=true');
        return response.data;
    },
};
