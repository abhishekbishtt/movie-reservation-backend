import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@utils/formatters';
import { CONVENIENCE_FEE_PERCENT } from '@utils/constants';
import { Shield, CreditCard, Check } from 'lucide-react';
import { Button } from '@components/common/Button';
import { paymentService } from '@services/paymentService';
import toast from 'react-hot-toast';
import './PaymentSection.css';

export function PaymentSection({
    reservation,
    movie,
    showtime,
    selectedSeats,
    pricePerSeat,
    onPaymentSuccess,
    onPaymentError,
}) {
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = selectedSeats.length * pricePerSeat;
    const convenienceFee = Math.round(subtotal * (CONVENIENCE_FEE_PERCENT - 1));
    const total = subtotal + convenienceFee;

    const handleMockPayment = async () => {
        setIsProcessing(true);

        try {
            const response = await paymentService.mockPayment(reservation.id);
            toast.success('Payment successful!');
            onPaymentSuccess(response);
        } catch (error) {
            toast.error('Payment failed. Please try again.');
            onPaymentError?.(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRazorpayPayment = async () => {
        setIsProcessing(true);

        try {
            // Create payment order
            const orderData = await paymentService.createPayment(reservation.id);

            // Initialize Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency || 'INR',
                name: 'CineBook',
                description: `Tickets for ${movie.title}`,
                order_id: orderData.razorpay_order_id,
                handler: async (response) => {
                    try {
                        const confirmData = await paymentService.confirmPayment(orderData.payment_id, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        toast.success('Payment successful!');
                        onPaymentSuccess(confirmData);
                    } catch (error) {
                        toast.error('Payment verification failed');
                        onPaymentError?.(error);
                    }
                },
                prefill: {
                    email: '',
                    contact: '',
                },
                theme: {
                    color: '#3b82f6',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error('Failed to initialize payment');
            onPaymentError?.(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            className="payment-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="payment-header">
                <Shield className="payment-icon" size={24} />
                <div>
                    <h3>Secure Payment</h3>
                    <p>Your transaction is protected by 256-bit encryption</p>
                </div>
            </div>

            <div className="payment-breakdown">
                <div className="payment-row">
                    <span>Ticket Price ({selectedSeats.length} × {formatCurrency(pricePerSeat)})</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="payment-row">
                    <span>Convenience Fee</span>
                    <span>{formatCurrency(convenienceFee)}</span>
                </div>
                <div className="payment-row payment-total">
                    <span>Amount Payable</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </div>

            <div className="payment-actions">
                {/* Mock Payment for Development */}
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isProcessing}
                    onClick={handleMockPayment}
                    leftIcon={<CreditCard size={20} />}
                >
                    Pay {formatCurrency(total)}
                </Button>

                <p className="payment-note">
                    <Check size={14} /> Instant confirmation after payment
                </p>
            </div>

            <div className="payment-methods">
                <p>We accept</p>
                <div className="payment-method-icons">
                    <span>💳 Cards</span>
                    <span>📱 UPI</span>
                    <span>🏦 Net Banking</span>
                    <span>💰 Wallets</span>
                </div>
            </div>
        </motion.div>
    );
}
