// Debounce function
export const debounce = (func, wait = 300) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// Throttle function
export const throttle = (func, limit = 300) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// Generate seat ID from row and seat number
export const generateSeatId = (rowNumber, seatNumber) => {
    const rowLabel = String.fromCharCode(64 + rowNumber);
    return `${rowLabel}${seatNumber}`;
};

// Parse seat ID to get row and seat number
export const parseSeatId = (seatId) => {
    const rowLabel = seatId.charAt(0);
    const seatNumber = parseInt(seatId.slice(1), 10);
    const rowNumber = rowLabel.charCodeAt(0) - 64;
    return { rowLabel, rowNumber, seatNumber };
};

// Get error message from API error
export const getErrorMessage = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

// Storage helpers
export const storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },
};

// Generate next 7 days array
export const getNext7Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date);
    }

    return days;
};

// Check if date is today
export const isToday = (date) => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

// Check if date is tomorrow
export const isTomorrow = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
        date.getDate() === tomorrow.getDate() &&
        date.getMonth() === tomorrow.getMonth() &&
        date.getFullYear() === tomorrow.getFullYear()
    );
};

// Class names helper
export const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

// Sleep utility
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Truncate text
export const truncate = (text, length = 100) => {
    if (!text || text.length <= length) return text;
    return text.slice(0, length).trim() + '...';
};

// Capitalize first letter
export const capitalize = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Generate random ID
export const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
};
