import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Mail, Ticket, Calendar, Clock, MapPin } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '@utils/formatters';
import { Button } from '@components/common/Button';
import './BookingConfirmation.css';

export function BookingConfirmation({ booking, movie, showtime, payment }) {
    const navigate = useNavigate();

    return (
        <motion.div
            className="booking-confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            {/* Success Animation */}
            <div className="confirmation-success">
                <motion.div
                    className="success-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                >
                    <CheckCircle size={48} />
                </motion.div>
                <h2>Booking Confirmed!</h2>
                <p>Your tickets have been booked successfully</p>
            </div>

            {/* Booking Details */}
            <div className="confirmation-ticket">
                <div className="ticket-header">
                    <span className="ticket-label">Booking ID</span>
                    <span className="ticket-id">{booking?.confirmationNumber || booking?.id}</span>
                </div>

                <div className="ticket-movie">
                    {movie?.poster_url && (
                        <img src={movie.poster_url} alt={movie.title} className="ticket-poster" />
                    )}
                    <div className="ticket-movie-info">
                        <h3>{movie?.title}</h3>
                        <p>{movie?.language} • {movie?.age_rating}</p>
                    </div>
                </div>

                <div className="ticket-details">
                    <div className="ticket-detail">
                        <Calendar size={16} />
                        <span>{formatDate(showtime?.show_time, 'EEEE, d MMMM yyyy')}</span>
                    </div>
                    <div className="ticket-detail">
                        <Clock size={16} />
                        <span>{formatTime(showtime?.show_time)}</span>
                    </div>
                    <div className="ticket-detail">
                        <MapPin size={16} />
                        <span>
                            {showtime?.Hall?.Theater?.name} - {showtime?.Hall?.name}
                        </span>
                    </div>
                    <div className="ticket-detail">
                        <Ticket size={16} />
                        <span>
                            {booking?.seats?.length || 0} Ticket(s): {booking?.seats?.join(', ')}
                        </span>
                    </div>
                </div>

                <div className="ticket-amount">
                    <span>Total Paid</span>
                    <span className="amount">{formatCurrency(payment?.amount || booking?.totalAmount)}</span>
                </div>

                {/* QR Code Placeholder */}
                <div className="ticket-qr">
                    <div className="qr-placeholder">
                        <span>QR</span>
                    </div>
                    <p>Show this at the theater</p>
                </div>
            </div>

            {/* Actions */}
            <div className="confirmation-actions">
                <Button
                    variant="primary"
                    leftIcon={<Download size={18} />}
                    onClick={() => toast.info('Download feature coming soon!')}
                >
                    Download Ticket
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => navigate('/my-bookings')}
                >
                    View All Bookings
                </Button>
            </div>

            {/* Email Note */}
            <div className="confirmation-note">
                <Mail size={16} />
                <p>A confirmation email has been sent to your registered email address</p>
            </div>

            {/* Back to Home */}
            <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="back-home-btn"
            >
                Back to Home
            </Button>
        </motion.div>
    );
}
