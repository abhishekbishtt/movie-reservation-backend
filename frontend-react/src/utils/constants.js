// App Constants
export const APP_NAME = 'CineBook';

// Booking Constants
export const MAX_SEATS_PER_BOOKING = 10;
export const CONVENIENCE_FEE_PERCENT = 1.18; // 18% GST

// Seat Types
export const SEAT_TYPES = {
    REGULAR: 'regular',
    PREMIUM: 'premium',
    RECLINER: 'recliner',
    WHEELCHAIR: 'wheelchair',
};

// Seat Status
export const SEAT_STATUS = {
    AVAILABLE: 'available',
    BOOKED: 'booked',
    SELECTED: 'selected',
    RESERVED: 'reserved',
};

// Booking Status
export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired',
};

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
};

// Age Ratings
export const AGE_RATINGS = ['U', 'UA', 'A', 'S'];

// Languages
export const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi'];

// Genres
export const GENRES = [
    'Action',
    'Adventure',
    'Animation',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Family',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
];

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        REFRESH_TOKEN: '/auth/refresh-token',
    },
    MOVIES: {
        LIST: '/movies',
        FEATURED: '/movies/featured',
        SEARCH: '/movies/search',
        DETAIL: (id) => `/movies/${id}`,
    },
    SHOWTIMES: {
        BY_MOVIE: (movieId) => `/showtime/movie/${movieId}`,
        DETAIL: (id) => `/showtime/${id}`,
        SEATS: (id) => `/showtime/${id}/seats`,
        RESERVE: (id) => `/showtime/${id}/reserve`,
    },
    BOOKINGS: {
        CREATE: '/booking',
        MY_BOOKINGS: '/booking/me',
        DETAIL: (id) => `/booking/${id}`,
        CANCEL: (id) => `/booking/${id}/cancel`,
    },
    PAYMENTS: {
        CREATE: '/payment',
        CONFIRM: (id) => `/payment/${id}/confirm`,
        HISTORY: '/payment/history',
        MOCK: '/payment/mock',
    },
    PROFILE: {
        GET: '/profile',
        UPDATE: '/profile',
    },
};

// Routes
export const ROUTES = {
    HOME: '/',
    MOVIES: '/movies',
    MOVIE_DETAIL: (id) => `/movies/${id}`,
    BOOKING: (movieId) => `/booking/${movieId}`,
    MY_BOOKINGS: '/my-bookings',
    PROFILE: '/profile',
    THEATERS: '/theaters',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    ADMIN: {
        DASHBOARD: '/admin',
        MOVIES: '/admin/movies',
        SHOWTIMES: '/admin/showtimes',
        BOOKINGS: '/admin/bookings',
        PAYMENTS: '/admin/payments',
        USERS: '/admin/users',
    },
};
