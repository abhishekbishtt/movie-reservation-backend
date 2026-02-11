import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

// Format currency in INR
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Format movie duration (minutes to hours/minutes)
export const formatDuration = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
};

// Format date for display
export const formatDate = (dateString, formatStr = 'MMM d, yyyy') => {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '';
    return format(date, formatStr);
};

// Format time for display
export const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '';
    return format(date, 'h:mm a');
};

// Format date with time
export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '';
    return format(date, 'MMM d, yyyy h:mm a');
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '';
    return formatDistanceToNow(date, { addSuffix: true });
};

// Format date for API (YYYY-MM-DD)
export const formatDateForAPI = (date) => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
};

// Get day name
export const getDayName = (date, short = false) => {
    if (!date) return '';
    return format(date, short ? 'EEE' : 'EEEE');
};

// Get day label (Today, Tomorrow, or day name)
export const getDayLabel = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate.getTime() === today.getTime()) return 'Today';
    if (inputDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return format(inputDate, 'EEE');
};

// Format phone number
export const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    return phone;
};

// Format seat list
export const formatSeatList = (seats) => {
    if (!seats || seats.length === 0) return '';
    return seats.sort().join(', ');
};

// Format rating
export const formatRating = (rating) => {
    if (!rating && rating !== 0) return 'N/A';
    return Number(rating).toFixed(1);
};
