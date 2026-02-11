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
