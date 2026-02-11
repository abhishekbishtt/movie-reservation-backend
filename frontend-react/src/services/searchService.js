import api from './api';

export const searchService = {
    // Get search suggestions (autocomplete)
    getSuggestions: async (query, limit = 5) => {
        const response = await api.get(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
        return response.data;
    },
};
