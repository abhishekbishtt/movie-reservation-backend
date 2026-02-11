

const {
    Payment,
    Reservation,
    User,
    Showtime,
    Movie,
    BookedSeats
} = require('../models');
const PaymentService = require('../services/payment.service');
const NotificationService = require('../services/notification.service');
const crypto = require('crypto');


exports.createPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { reservationId } = req.body;

        // Validate input
        if (!reservationId) {
            return res.status(400).json({
                success: false,
                message: 'Reservation ID is required'
            });
        }


        const reservation = await Reservation.findOne({
            where: {
                id: reservationId,
                user_id: userId,
                status: 'pending'  // Can only pay for pending reservations
            }
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Pending reservation not found'
            });
        }


        if (reservation.expires_at && new Date(reservation.expires_at) < new Date()) {
            await reservation.update({ status: 'expired' });
            return res.status(400).json({
                success: false,
                message: 'Reservation has expired. Please book again.'
            });
        }


        const user = await User.findByPk(userId, { attributes: ['email'] });


        const razorpayOrder = await PaymentService.createPaymentOrder(
            parseFloat(reservation.total_amount),
            reservationId,
            user.email
        );


        const paymentId = `pay_${Date.now()}`;

        const payment = await Payment.create({
            id: paymentId,
            reservation_id: reservationId,
            user_id: userId,
            razorpay_order_id: razorpayOrder.orderId,
            amount: reservation.total_amount,
            status: 'created'
        });


        res.status(201).json({
            success: true,
            message: 'Payment order created',
            payment: {
                id: payment.id,
                orderId: razorpayOrder.orderId,
                amount: razorpayOrder.amount,          // In paise (smallest unit)
                currency: razorpayOrder.currency,
                key: razorpayOrder.key,                // Razorpay key for frontend
                reservationId: reservationId
            },
            // Additional data for Razorpay checkout
            prefill: {
                name: req.user.name || '',
                email: user.email,
                contact: req.user.phone || ''
            }
        });

    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


exports.getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        const whereClause = { user_id: userId };
        if (status) {
            whereClause.status = status;
        }

        const payments = await Payment.findAll({
            where: whereClause,
            include: [{
                model: Reservation,
                as: 'reservation',
                include: [{
                    model: Showtime,
                    as: 'showtime',
                    include: [{
                        model: Movie,
                        as: 'movie',
                        attributes: ['id', 'title', 'poster_url']
                    }]
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment history'
        });
    }
};


exports.getPaymentById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { paymentId } = req.params;

        const payment = await Payment.findOne({
            where: {
                id: paymentId,
                user_id: userId
            },
            include: [{
                model: Reservation,
                as: 'reservation',
                include: [{
                    model: Showtime,
                    as: 'showtime',
                    include: [{ model: Movie, as: 'movie' }]
                }]
            }]
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.status(200).json({
            success: true,
            payment
        });

    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment'
        });
    }
};


exports.confirmPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { paymentId } = req.params;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Validate input
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification parameters'
            });
        }


        const payment = await Payment.findOne({
            where: {
                id: paymentId,
                user_id: userId,
                razorpay_order_id: razorpay_order_id
            }
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Idempotency check: If payment is already completed, return success immediately
        if (payment.status === 'completed') {
            return res.status(200).json({
                success: true,
                message: 'Payment already confirmed',
                payment: {
                    id: payment.id,
                    status: 'completed',
                    amount: payment.amount,
                    paidAt: payment.paid_at
                }
            });
        }


        const verificationResult = await PaymentService.verifyPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!verificationResult.isSucceeded) {
            // Payment verification failed
            await payment.update({
                status: 'failed',
                failure_reason: 'Signature verification failed'
            });

            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }


        await payment.update({
            razorpay_payment_id: razorpay_payment_id,
            razorpay_signature: razorpay_signature,
            status: 'completed',
            paid_at: new Date()
        });


        const reservation = await Reservation.findByPk(payment.reservation_id);
        await reservation.update({
            status: 'confirmed',
            confirmed_at: new Date()
        });


        await BookedSeats.update(
            {
                booking_status: 'confirmed',
                payment_id: payment.id
            },
            {
                where: {
                    showtime_id: reservation.showtime_id,
                    seat_id: { [require('sequelize').Op.in]: reservation.selected_seats }
                }
            }
        );


        NotificationService.sendBookingConfirmation(reservation.id)
            .catch(err => console.error('Email notification failed:', err));


        res.status(200).json({
            success: true,
            message: 'Payment confirmed successfully',
            payment: {
                id: payment.id,
                status: 'completed',
                amount: payment.amount,
                paidAt: payment.paid_at
            },
            reservation: {
                id: reservation.id,
                status: 'confirmed'
            }
        });

    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error confirming payment'
        });
    }
};


exports.handleWebhook = async (req, res) => {
    try {

        const webhookSignature = req.headers['x-razorpay-signature'];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (webhookSignature !== expectedSignature) {
            console.warn('Invalid webhook signature');
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }


        const event = req.body.event;
        const payload = req.body.payload;

        console.log(`📥 Razorpay webhook received: ${event}`);

        switch (event) {
            case 'payment.captured':
                // Payment was successful
                const paymentData = payload.payment.entity;
                const orderId = paymentData.order_id;
                const paymentId = paymentData.id;

                // Find and update payment
                const payment = await Payment.findOne({
                    where: { razorpay_order_id: orderId }
                });

                if (payment && payment.status !== 'completed') {
                    await payment.update({
                        razorpay_payment_id: paymentId,
                        status: 'completed',
                        paid_at: new Date(),
                        payment_method: paymentData.method
                    });

                    // Update reservation
                    const reservation = await Reservation.findByPk(payment.reservation_id);
                    if (reservation && reservation.status === 'pending') {
                        await reservation.update({
                            status: 'confirmed',
                            confirmed_at: new Date()
                        });

                        // Update booked seats
                        await BookedSeats.update(
                            { booking_status: 'confirmed', payment_id: payment.id },
                            {
                                where: {
                                    showtime_id: reservation.showtime_id,
                                    seat_id: { [require('sequelize').Op.in]: reservation.selected_seats }
                                }
                            }
                        );

                        // Send email
                        NotificationService.sendBookingConfirmation(reservation.id)
                            .catch(err => console.error('Webhook email failed:', err));
                    }
                }
                break;

            case 'payment.failed':
                // Payment failed
                const failedPaymentData = payload.payment.entity;
                const failedOrderId = failedPaymentData.order_id;

                const failedPayment = await Payment.findOne({
                    where: { razorpay_order_id: failedOrderId }
                });

                if (failedPayment) {
                    await failedPayment.update({
                        status: 'failed',
                        failure_reason: failedPaymentData.error_description || 'Payment failed'
                    });
                }
                break;

            case 'refund.created':
                // Refund was initiated
                console.log('Refund created:', payload);
                break;

            default:
                console.log(`Unhandled webhook event: ${event}`);
        }

        // Always return 200 to acknowledge receipt
        res.status(200).json({ success: true, received: true });

    } catch (error) {
        console.error('Webhook processing error:', error);
        // Still return 200 to avoid Razorpay retries
        res.status(200).json({ success: true, error: 'Processing failed' });
    }
};


exports.refundPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { reason, amount } = req.body;  // Optional partial refund amount


        const payment = await Payment.findByPk(paymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        if (payment.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Can only refund completed payments'
            });
        }

        if (payment.status === 'refunded') {
            return res.status(400).json({
                success: false,
                message: 'Payment has already been refunded'
            });
        }


        const refundResult = await PaymentService.refundPayment(
            payment.razorpay_payment_id,
            amount  // null for full refund
        );


        await payment.update({
            status: 'refunded',
            failure_reason: reason || 'Refund requested'
        });


        const reservation = await Reservation.findByPk(payment.reservation_id);
        if (reservation) {
            await reservation.update({
                status: 'cancelled',
                cancellation_reason: reason || 'Refund processed',
                cancelled_by: 'admin'
            });

            // Release booked seats
            await BookedSeats.update(
                { booking_status: 'cancelled' },
                {
                    where: {
                        showtime_id: reservation.showtime_id,
                        seat_id: { [require('sequelize').Op.in]: reservation.selected_seats }
                    }
                }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Refund processed successfully',
            refund: refundResult
        });

    } catch (error) {
        console.error('Refund error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing refund',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.mockPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { reservationId } = req.body;

        if (!reservationId) {
            return res.status(400).json({ success: false, message: 'Reservation ID is required' });
        }


        const reservation = await Reservation.findOne({
            where: {
                id: reservationId,
                user_id: userId,
                status: 'pending'
            }
        });

        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Pending reservation not found' });
        }


        const paymentId = `mock_pay_${Date.now()}`;
        const payment = await Payment.create({
            id: paymentId,
            reservation_id: reservationId,
            user_id: userId,
            razorpay_order_id: `mock_order_${Date.now()}`,
            razorpay_payment_id: `mock_rp_${Date.now()}`,
            amount: reservation.total_amount,
            status: 'completed',
            paid_at: new Date(),
            payment_method: 'mock_card'
        });


        await reservation.update({
            status: 'confirmed',
            confirmed_at: new Date()
        });


        await BookedSeats.update(
            {
                booking_status: 'confirmed',
                payment_id: payment.id
            },
            {
                where: {
                    showtime_id: reservation.showtime_id,
                    seat_id: { [require('sequelize').Op.in]: reservation.selected_seats }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Mock payment successful',
            payment,
            reservation
        });

    } catch (error) {
        console.error('Mock payment error:', error);
        res.status(500).json({ success: false, message: 'Error processing mock payment' });
    }
};
