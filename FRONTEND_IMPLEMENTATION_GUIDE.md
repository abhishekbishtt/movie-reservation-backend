# 🎬 CineBook React Frontend Implementation Guide

> **Purpose**: Complete reference documentation for building a production-ready React frontend for the Movie Reservation System.
> 
> **Backend**: Already running at `http://localhost:3000`
> 
> **Target**: React 18+ with Vite, React Router, and modern best practices

---

## 📋 Table of Contents

1. [Project Setup](#1-project-setup)
2. [Folder Structure](#2-folder-structure)
3. [Tech Stack & Dependencies](#3-tech-stack--dependencies)
4. [Design System](#4-design-system)
5. [API Service Layer](#5-api-service-layer)
6. [Authentication System](#6-authentication-system)
7. [Components Breakdown](#7-components-breakdown)
8. [Pages & Routes](#8-pages--routes)
9. [State Management](#9-state-management)
10. [Feature Implementation Guide](#10-feature-implementation-guide)
11. [Backend API Reference](#11-backend-api-reference)

---

## 1. Project Setup

### Initialize React Project with Vite

```bash
cd /Users/abhishekbisht/Desktop/backend\ movie\ reservation/booking-app
npx create-vite@latest frontend-react --template react
cd frontend-react
npm install
```

### Essential Dependencies

```bash
# Routing
npm install react-router-dom

# HTTP Client
npm install axios

# State Management (Context API is sufficient, but optionally)
npm install zustand   # Lightweight alternative to Redux

# UI & Styling
npm install framer-motion   # Animations
npm install lucide-react    # Icons
npm install react-hot-toast # Notifications

# Forms
npm install react-hook-form
npm install zod @hookform/resolvers   # Validation

# Date handling
npm install date-fns

# Payment (Razorpay)
# Load via CDN in index.html

# Dev dependencies
npm install -D @types/node
```

### Vite Configuration (`vite.config.js`)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@context': path.resolve(__dirname, './src/context'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

### Environment Variables (`.env`)

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 2. Folder Structure

```
frontend-react/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx (admin)
│   │   │   └── Layout.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── movies/
│   │   │   ├── MovieCard.jsx
│   │   │   ├── MovieGrid.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── MovieFilters.jsx
│   │   │   ├── HeroCarousel.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── booking/
│   │   │   ├── DateSelector.jsx
│   │   │   ├── ShowtimeSelector.jsx
│   │   │   ├── SeatMap.jsx
│   │   │   ├── SeatLegend.jsx
│   │   │   ├── BookingSummary.jsx
│   │   │   ├── PaymentSection.jsx
│   │   │   └── BookingConfirmation.jsx
│   │   ├── theaters/
│   │   │   ├── TheaterCard.jsx
│   │   │   ├── TheaterList.jsx
│   │   │   └── CitySelector.jsx
│   │   ├── profile/
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── BookingHistory.jsx
│   │   │   ├── PaymentHistory.jsx
│   │   │   └── EditProfileForm.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── MovieManager.jsx
│   │       ├── ShowtimeManager.jsx
│   │       ├── BookingManager.jsx
│   │       ├── UserManager.jsx
│   │       └── AnalyticsCharts.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── BookingContext.jsx
│   │   └── CityContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useMovies.js
│   │   ├── useBooking.js
│   │   ├── useShowtimes.js
│   │   └── useLocalStorage.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Movies.jsx
│   │   ├── MovieDetail.jsx
│   │   ├── Booking.jsx
│   │   ├── Theaters.jsx
│   │   ├── MyBookings.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── NotFound.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminMovies.jsx
│   │       ├── AdminShowtimes.jsx
│   │       ├── AdminBookings.jsx
│   │       ├── AdminPayments.jsx
│   │       └── AdminUsers.jsx
│   ├── services/
│   │   ├── api.js           # Axios instance
│   │   ├── authService.js
│   │   ├── movieService.js
│   │   ├── showtimeService.js
│   │   ├── bookingService.js
│   │   ├── paymentService.js
│   │   ├── profileService.js
│   │   ├── searchService.js
│   │   └── adminService.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── styles/
│   │   ├── index.css        # Global styles
│   │   ├── variables.css    # CSS custom properties
│   │   └── animations.css
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── .env
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## 3. Tech Stack & Dependencies

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | React 18 | UI Library |
| Build Tool | Vite | Fast development |
| Routing | React Router v6 | Navigation |
| HTTP | Axios | API calls |
| State | Context API + Zustand | Global state |
| Forms | React Hook Form + Zod | Form handling |
| Styling | CSS Modules / Vanilla CSS | Styling |
| Icons | Lucide React | Icon library |
| Animations | Framer Motion | Smooth animations |
| Notifications | React Hot Toast | Toast messages |
| Dates | date-fns | Date formatting |
| Payment | Razorpay SDK | Payment gateway |

---

## 4. Design System

### Color Palette (`variables.css`)

```css
:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* Accent (Cinema Red/Gold) */
  --accent-gold: #fbbf24;
  --accent-red: #ef4444;
  --accent-purple: #8b5cf6;

  /* Neutral (Dark Theme) */
  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #262626;
  --bg-card: #1f1f1f;
  --bg-elevated: #2a2a2a;

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;

  /* Status */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;

  /* Seat Colors */
  --seat-available: #22c55e;
  --seat-selected: #3b82f6;
  --seat-booked: #71717a;
  --seat-premium: #fbbf24;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3);

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Outfit', sans-serif;
}
```

### Typography

```css
/* Font imports in index.html */
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Component Styling Guidelines

1. **Dark theme first** - Cinema aesthetic with dark backgrounds
2. **Glassmorphism** for cards and modals
3. **Gradient accents** for CTAs and highlights
4. **Micro-animations** on hover/focus states
5. **Smooth transitions** (200-300ms)

---

## 5. API Service Layer

### Base API Configuration (`services/api.js`)

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors & token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Auth Service (`services/authService.js`)

```javascript
import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    // userData: { firstName, lastName, email, password }
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    // credentials: { email, password }
    const response = await api.post('/auth/login', credentials);
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh-token', { refreshToken });
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    return response.data;
  },
};
```

### Movie Service (`services/movieService.js`)

```javascript
import api from './api';

export const movieService = {
  // Get all movies with optional filters
  getMovies: async (filters = {}) => {
    // filters: { genre, language, ageRating, page, limit }
    const params = new URLSearchParams(filters);
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
```

### Showtime Service (`services/showtimeService.js`)

```javascript
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
```

### Booking Service (`services/bookingService.js`)

```javascript
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
```

### Payment Service (`services/paymentService.js`)

```javascript
import api from './api';

export const paymentService = {
  // Create payment order (Razorpay)
  createPayment: async (reservationId) => {
    const response = await api.post('/payment', { reservationId });
    return response.data;
  },

  // Confirm payment after Razorpay success
  confirmPayment: async (paymentId, razorpayData) => {
    // razorpayData: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    const response = await api.post(`/payment/${paymentId}/confirm`, razorpayData);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async () => {
    const response = await api.get('/payment/history');
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    const response = await api.get(`/payment/${paymentId}`);
    return response.data;
  },

  // Mock payment (development only)
  mockPayment: async (reservationId) => {
    const response = await api.post('/payment/mock', { reservationId });
    return response.data;
  },
};
```

### Profile Service (`services/profileService.js`)

```javascript
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
```

### Search Service (`services/searchService.js`)

```javascript
import api from './api';

export const searchService = {
  // Get search suggestions (autocomplete)
  getSuggestions: async (query, limit = 5) => {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  },
};
```

### Admin Service (`services/adminService.js`)

```javascript
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
```

---

## 6. Authentication System

### Auth Context (`context/AuthContext.jsx`)

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@services/authService';
import { profileService } from '@services/profileService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await profileService.getProfile();
        setUser(response.user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    // Auto-login after registration
    if (response.accessToken) {
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setUser(response.user);
      setIsAuthenticated(true);
    }
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Protected Route Component (`components/auth/ProtectedRoute.jsx`)

```jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

export function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
```

---

## 7. Components Breakdown

### 7.1 Common Components

#### Button (`components/common/Button.jsx`)

```jsx
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

export const Button = forwardRef(({
  children,
  variant = 'primary', // primary, secondary, ghost, danger
  size = 'md',         // sm, md, lg
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="btn-spinner" />
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
```

#### Modal (`components/common/Modal.jsx`)

```jsx
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',    // sm, md, lg, xl, full
  showCloseButton = true,
}) {
  const overlayRef = useRef();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="modal-overlay"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`modal modal-${size}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {(title || showCloseButton) && (
              <div className="modal-header">
                {title && <h2 className="modal-title">{title}</h2>}
                {showCloseButton && (
                  <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                  </button>
                )}
              </div>
            )}
            <div className="modal-content">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 7.2 Movie Components

#### MovieCard (`components/movies/MovieCard.jsx`)

```jsx
import { Link } from 'react-router-dom';
import { Star, Clock, Calendar } from 'lucide-react';
import { formatDuration } from '@utils/formatters';
import './MovieCard.css';

export function MovieCard({ movie, onBookClick }) {
  const {
    id,
    title,
    poster_url,
    rating,
    age_rating,
    duration,
    language,
    genre,
    release_date,
  } = movie;

  return (
    <div className="movie-card">
      <Link to={`/movies/${id}`} className="movie-card-poster">
        <img
          src={poster_url || '/placeholder-poster.jpg'}
          alt={title}
          loading="lazy"
        />
        <div className="movie-card-overlay">
          <span className="age-badge">{age_rating}</span>
          {rating && (
            <span className="rating-badge">
              <Star size={14} fill="currentColor" /> {rating}
            </span>
          )}
        </div>
      </Link>
      
      <div className="movie-card-info">
        <h3 className="movie-card-title">{title}</h3>
        
        <div className="movie-card-meta">
          <span className="meta-item">
            <Clock size={14} /> {formatDuration(duration)}
          </span>
          <span className="meta-item">{language}</span>
        </div>
        
        <div className="movie-card-genres">
          {genre?.slice(0, 2).map((g) => (
            <span key={g} className="genre-tag">{g}</span>
          ))}
        </div>
        
        <button
          className="btn btn-primary btn-sm btn-full"
          onClick={() => onBookClick(movie)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
```

#### SeatMap (`components/booking/SeatMap.jsx`)

```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './SeatMap.css';

export function SeatMap({
  seats,            // Array of seat objects from API
  selectedSeats,    // Array of selected seat IDs
  onSeatSelect,     // Callback when seat is clicked
  maxSeats = 10,    // Maximum selectable seats
  pricePerSeat,
}) {
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    const rowLabel = String.fromCharCode(64 + seat.row_number); // 1 -> A, 2 -> B
    if (!acc[rowLabel]) acc[rowLabel] = [];
    acc[rowLabel].push(seat);
    return acc;
  }, {});

  const rows = Object.keys(seatsByRow).sort();

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return;
    
    const seatId = `${String.fromCharCode(64 + seat.row_number)}${seat.seat_number}`;
    const isSelected = selectedSeats.includes(seatId);
    
    if (isSelected) {
      onSeatSelect(selectedSeats.filter((s) => s !== seatId));
    } else if (selectedSeats.length < maxSeats) {
      onSeatSelect([...selectedSeats, seatId]);
    }
  };

  const getSeatStatus = (seat) => {
    const seatId = `${String.fromCharCode(64 + seat.row_number)}${seat.seat_number}`;
    if (seat.status === 'booked') return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    if (seat.seat_type === 'premium') return 'premium';
    if (seat.seat_type === 'wheelchair') return 'wheelchair';
    return 'available';
  };

  return (
    <div className="seat-map-container">
      <div className="screen">
        <div className="screen-curve"></div>
        <span>SCREEN</span>
      </div>
      
      <div className="seat-grid">
        {rows.map((row) => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            <div className="seats">
              {seatsByRow[row]
                .sort((a, b) => a.seat_number - b.seat_number)
                .map((seat) => {
                  const status = getSeatStatus(seat);
                  const seatId = `${row}${seat.seat_number}`;
                  
                  return (
                    <motion.button
                      key={seat.id}
                      className={`seat seat-${status}`}
                      onClick={() => handleSeatClick(seat)}
                      disabled={status === 'booked'}
                      whileHover={status !== 'booked' ? { scale: 1.1 } : {}}
                      whileTap={status !== 'booked' ? { scale: 0.95 } : {}}
                      title={`Seat ${seatId} - ${status}`}
                    >
                      {seat.seat_number}
                    </motion.button>
                  );
                })}
            </div>
            <span className="row-label">{row}</span>
          </div>
        ))}
      </div>
      
      <SeatLegend />
      
      {selectedSeats.length > 0 && (
        <div className="selection-summary">
          <span>
            Selected: <strong>{selectedSeats.join(', ')}</strong>
          </span>
          <span className="total-price">
            Total: <strong>₹{selectedSeats.length * pricePerSeat}</strong>
          </span>
        </div>
      )}
    </div>
  );
}

function SeatLegend() {
  return (
    <div className="seat-legend">
      <div className="legend-item">
        <span className="seat seat-available"></span>
        <span>Available</span>
      </div>
      <div className="legend-item">
        <span className="seat seat-selected"></span>
        <span>Selected</span>
      </div>
      <div className="legend-item">
        <span className="seat seat-booked"></span>
        <span>Booked</span>
      </div>
      <div className="legend-item">
        <span className="seat seat-premium"></span>
        <span>Premium</span>
      </div>
    </div>
  );
}
```

---

## 8. Pages & Routes

### Router Configuration (`router.jsx`)

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@components/layout/Layout';
import { AdminLayout } from '@components/layout/AdminLayout';
import { ProtectedRoute } from '@components/auth/ProtectedRoute';

// Pages
import Home from '@pages/Home';
import Movies from '@pages/Movies';
import MovieDetail from '@pages/MovieDetail';
import Booking from '@pages/Booking';
import Theaters from '@pages/Theaters';
import Login from '@pages/Login';
import Register from '@pages/Register';
import ForgotPassword from '@pages/ForgotPassword';
import ResetPassword from '@pages/ResetPassword';
import MyBookings from '@pages/MyBookings';
import Profile from '@pages/Profile';
import NotFound from '@pages/NotFound';

// Admin Pages
import AdminDashboard from '@pages/admin/AdminDashboard';
import AdminMovies from '@pages/admin/AdminMovies';
import AdminShowtimes from '@pages/admin/AdminShowtimes';
import AdminBookings from '@pages/admin/AdminBookings';
import AdminPayments from '@pages/admin/AdminPayments';
import AdminUsers from '@pages/admin/AdminUsers';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'movies', element: <Movies /> },
      { path: 'movies/:movieId', element: <MovieDetail /> },
      { path: 'theaters', element: <Theaters /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password/:token', element: <ResetPassword /> },
      {
        path: 'booking/:movieId',
        element: (
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-bookings',
        element: (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'movies', element: <AdminMovies /> },
      { path: 'showtimes', element: <AdminShowtimes /> },
      { path: 'bookings', element: <AdminBookings /> },
      { path: 'payments', element: <AdminPayments /> },
      { path: 'users', element: <AdminUsers /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
```

---

## 9. State Management

### Booking Context (`context/BookingContext.jsx`)

```jsx
import { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext(null);

const initialState = {
  movie: null,
  showtime: null,
  selectedDate: null,
  selectedSeats: [],
  reservation: null,
  payment: null,
  step: 1, // 1: Select showtime, 2: Select seats, 3: Payment, 4: Confirmation
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_MOVIE':
      return { ...state, movie: action.payload };
    
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload };
    
    case 'SET_SHOWTIME':
      return { ...state, showtime: action.payload, step: 2 };
    
    case 'SET_SEATS':
      return { ...state, selectedSeats: action.payload };
    
    case 'SET_RESERVATION':
      return { ...state, reservation: action.payload, step: 3 };
    
    case 'SET_PAYMENT':
      return { ...state, payment: action.payload, step: 4 };
    
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 4) };
    
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const actions = {
    setMovie: (movie) => dispatch({ type: 'SET_MOVIE', payload: movie }),
    setDate: (date) => dispatch({ type: 'SET_DATE', payload: date }),
    setShowtime: (showtime) => dispatch({ type: 'SET_SHOWTIME', payload: showtime }),
    setSeats: (seats) => dispatch({ type: 'SET_SEATS', payload: seats }),
    setReservation: (reservation) => dispatch({ type: 'SET_RESERVATION', payload: reservation }),
    setPayment: (payment) => dispatch({ type: 'SET_PAYMENT', payload: payment }),
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    prevStep: () => dispatch({ type: 'PREV_STEP' }),
    reset: () => dispatch({ type: 'RESET' }),
  };

  return (
    <BookingContext.Provider value={{ ...state, ...actions }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
```

---

## 10. Feature Implementation Guide

### 10.1 Home Page

**Components needed:**
- `HeroCarousel` - Featured movies slider
- `MovieGrid` - Now showing movies
- `SearchBar` - Autocomplete search

**API calls:**
```javascript
// On mount
const featured = await movieService.getFeaturedMovies();
const movies = await movieService.getMovies();
```

### 10.2 Movie Details Page

**Components needed:**
- `MovieDetails` - Full movie info
- `DateSelector` - Date pills for next 7 days
- `ShowtimeSelector` - Available showtimes

**API calls:**
```javascript
// On mount
const movie = await movieService.getMovieById(movieId);

// When date selected
const showtimes = await showtimeService.getShowtimesByMovie(movieId, selectedDate);
```

### 10.3 Booking Flow

**Step 1: Select Date & Showtime**
```javascript
// Render next 7 days as selectable pills
// On date select, fetch showtimes
const showtimes = await showtimeService.getShowtimesByMovie(movieId, date);
```

**Step 2: Select Seats**
```javascript
// Fetch seat availability
const { seats, hall } = await showtimeService.getSeatAvailability(showtimeId);

// Render SeatMap component
// On continue, create reservation
const reservation = await bookingService.createBooking({
  showtimeId,
  selectedSeats: ['A1', 'A2', 'A3'],
});
```

**Step 3: Payment**
```javascript
// Create payment order
const paymentOrder = await paymentService.createPayment(reservation.id);

// Initialize Razorpay
const razorpay = new Razorpay({
  key: RAZORPAY_KEY_ID,
  amount: paymentOrder.amount,
  order_id: paymentOrder.razorpay_order_id,
  handler: async (response) => {
    // Confirm payment
    await paymentService.confirmPayment(paymentOrder.id, {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    });
    // Navigate to confirmation
  },
});
razorpay.open();

// OR use mock payment for development
await paymentService.mockPayment(reservation.id);
```

**Step 4: Confirmation**
```javascript
// Display booking details
// Provide download ticket option
```

### 10.4 My Bookings Page

**Tabs:** Upcoming | Past | Cancelled

```javascript
// Fetch user's bookings
const { bookings } = await bookingService.getMyBookings();

// Filter by status for tabs
const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.showtime.show_date) >= new Date());
const past = bookings.filter(b => new Date(b.showtime.show_date) < new Date());
const cancelled = bookings.filter(b => b.status === 'cancelled');
```

### 10.5 Admin Dashboard

**Stats to display:**
- Total revenue (daily/weekly/monthly)
- Total bookings
- Occupancy rate
- Active users

```javascript
// Fetch analytics
const revenue = await adminService.getRevenue('weekly');
const occupancy = await adminService.getOccupancy();
const bookings = await adminService.getAllBookings({ limit: 10 });
```

---

## 11. Backend API Reference

### Authentication Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/register` | `{ firstName, lastName, email, password }` | `{ user, accessToken, refreshToken }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ user, accessToken, refreshToken }` |
| POST | `/api/auth/logout` | - | `{ message }` |
| POST | `/api/auth/forgot-password` | `{ email }` | `{ message }` |
| POST | `/api/auth/reset-password` | `{ token, newPassword }` | `{ message }` |
| POST | `/api/auth/refresh-token` | `{ refreshToken }` | `{ accessToken }` |

### Movie Endpoints

| Method | Endpoint | Query Params | Response |
|--------|----------|--------------|----------|
| GET | `/api/movies` | `genre, language, ageRating, page, limit, trending` | `{ movies, total, page }` |
| GET | `/api/movies/featured` | - | `{ movies }` |
| GET | `/api/movies/search` | `q` | `{ movies }` |
| GET | `/api/movies/:movieId` | - | `{ movie }` |

### Showtime Endpoints

| Method | Endpoint | Query/Body | Response |
|--------|----------|------------|----------|
| GET | `/api/showtime/movie/:movieId` | `date` | `{ showtimes }` |
| GET | `/api/showtime/:showtimeId` | - | `{ showtime }` |
| GET | `/api/showtime/:showtimeId/seats` | - | `{ seats, hall, booked_seats }` |
| POST | `/api/showtime/:showtimeId/reserve` | `{ selectedSeats: ['A1','A2'] }` | `{ reservation }` |

### Booking Endpoints (Auth Required)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/booking` | `{ showtimeId, selectedSeats }` | `{ reservation }` |
| GET | `/api/booking/me` | - | `{ bookings }` |
| GET | `/api/booking/:bookingId` | - | `{ booking }` |
| PATCH | `/api/booking/:bookingId/cancel` | `{ reason }` | `{ booking }` |

### Payment Endpoints (Auth Required)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/payment` | `{ reservationId }` | `{ payment, razorpay_order_id }` |
| POST | `/api/payment/mock` | `{ reservationId }` | `{ payment, booking }` |
| GET | `/api/payment/history` | - | `{ payments }` |
| GET | `/api/payment/:paymentId` | - | `{ payment }` |
| POST | `/api/payment/:paymentId/confirm` | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` | `{ payment, booking }` |

### Profile Endpoints (Auth Required)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/profile` | - | `{ user }` |
| PUT | `/api/profile` | `{ firstName, lastName, phone, currentPassword, newPassword }` | `{ user }` |
| PUT | `/api/profile/deactivate` | `{ password, reason }` | `{ message }` |

### Search Endpoint

| Method | Endpoint | Query Params | Response |
|--------|----------|--------------|----------|
| GET | `/api/search` | `q, limit` | `{ suggestions }` |

### Admin Endpoints (Admin Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/users/:userId` | Get user details |
| POST | `/api/admin/movies` | Create movie |
| PUT | `/api/admin/movies/:movieId` | Update movie |
| DELETE | `/api/admin/movies/:movieId` | Delete movie |
| GET | `/api/admin/bookings` | List all bookings |
| GET | `/api/admin/payments` | List all payments |
| POST | `/api/admin/showtimes` | Create showtime |
| PUT | `/api/admin/showtimes/:id` | Update showtime |
| DELETE | `/api/admin/showtimes/:id` | Delete showtime |
| GET | `/api/admin/analytics/revenue` | Revenue stats |
| GET | `/api/admin/analytics/occupancy` | Occupancy stats |

---

## 🚀 Quick Start Checklist

### Phase 1: Foundation (Day 1)
- [ ] Initialize Vite React project
- [ ] Install all dependencies
- [ ] Set up folder structure
- [ ] Configure Vite with path aliases
- [ ] Create design system (variables.css)
- [ ] Create API service layer
- [ ] Set up AuthContext

### Phase 2: Core Features (Day 2-3)
- [ ] Create Layout with Navbar/Footer
- [ ] Build Home page with HeroCarousel and MovieGrid
- [ ] Implement Login/Register pages
- [ ] Build MovieDetail page
- [ ] Create SearchBar with autocomplete

### Phase 3: Booking Flow (Day 3-4)
- [ ] Build Booking page with steps
- [ ] Create DateSelector component
- [ ] Create ShowtimeSelector component
- [ ] Build SeatMap component
- [ ] Implement BookingSummary
- [ ] Integrate payment (mock first)
- [ ] Build BookingConfirmation

### Phase 4: User Features (Day 4-5)
- [ ] Build MyBookings page
- [ ] Build Profile page
- [ ] Add booking cancellation
- [ ] Add E-ticket download

### Phase 5: Admin Panel (Day 5-6)
- [ ] Build AdminDashboard
- [ ] Build MovieManager (CRUD)
- [ ] Build ShowtimeManager
- [ ] Build BookingManager
- [ ] Build PaymentManager
- [ ] Add Analytics charts

### Phase 6: Polish (Day 6-7)
- [ ] Add loading states (skeletons)
- [ ] Add error boundaries
- [ ] Add toast notifications
- [ ] Responsive design fixes
- [ ] Performance optimization
- [ ] Testing

---

## 📝 Notes for AI Agent

1. **Backend is already running** at `http://localhost:3000`
2. **Use the exact API endpoints** documented above
3. **Authentication tokens** are stored in localStorage as `token` and `refreshToken`
4. **All protected routes** require `Authorization: Bearer <token>` header
5. **Seat IDs** are formatted as `A1`, `B5`, etc. (row letter + seat number)
6. **Dates** should be in `YYYY-MM-DD` format for API calls
7. **Mock payment** is available at `/api/payment/mock` for development
8. **Admin role** is stored in `user.role === 'admin'`

---

**Document Version:** 1.0  
**Last Updated:** December 25, 2024  
**Author:** AI Assistant
