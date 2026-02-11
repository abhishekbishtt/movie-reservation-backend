import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Calendar, Clock, MapPin, XCircle, ExternalLink } from 'lucide-react';
import { bookingService } from '@services/bookingService';
import { formatDate, formatTime, formatCurrency } from '@utils/formatters';
import { getErrorMessage } from '@utils/helpers';
import { Button } from '@components/common/Button';
import { PageLoader } from '@components/common/Loader';
import { Modal } from '@components/common/Modal';
import toast from 'react-hot-toast';
import './MyBookings.css';

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [cancelModal, setCancelModal] = useState({ open: false, booking: null });
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingService.getMyBookings();
            setBookings(response.bookings || response || []);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!cancelModal.booking) return;

        setCancelling(true);
        try {
            await bookingService.cancelBooking(cancelModal.booking.id, 'User requested cancellation');
            toast.success('Booking cancelled successfully');
            setCancelModal({ open: false, booking: null });
            fetchBookings();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setCancelling(false);
        }
    };

    const filterBookings = (status) => {
        const now = new Date();
        return bookings.filter((booking) => {
            const showDate = new Date(booking.Showtime?.show_time || booking.showtime);

            switch (status) {
                case 'upcoming':
                    return showDate > now && booking.status === 'confirmed';
                case 'past':
                    return showDate <= now && booking.status === 'confirmed';
                case 'cancelled':
                    return booking.status === 'cancelled';
                default:
                    return true;
            }
        });
    };

    if (loading) {
        return <PageLoader text="Loading your bookings..." />;
    }

    const filteredBookings = filterBookings(activeTab);

    return (
        <div className="my-bookings-page">
            <div className="container">
                <div className="my-bookings-header">
                    <h1>My Bookings</h1>
                    <p>View and manage your movie tickets</p>
                </div>

                {/* Tabs */}
                <div className="bookings-tabs">
                    {['upcoming', 'past', 'cancelled'].map((tab) => (
                        <button
                            key={tab}
                            className={`booking-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            <span className="tab-count">{filterBookings(tab).length}</span>
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="bookings-empty">
                        <Ticket size={48} />
                        <h3>No {activeTab} bookings</h3>
                        <p>
                            {activeTab === 'upcoming'
                                ? "You don't have any upcoming bookings. Browse movies and book your tickets!"
                                : activeTab === 'cancelled'
                                    ? "You don't have any cancelled bookings."
                                    : "You don't have any past bookings yet."}
                        </p>
                        {activeTab === 'upcoming' && (
                            <Link to="/movies">
                                <Button variant="primary">Browse Movies</Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="bookings-list">
                        {filteredBookings.map((booking, index) => (
                            <motion.div
                                key={booking.id}
                                className={`booking-card ${booking.status === 'cancelled' ? 'cancelled' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="booking-card-poster">
                                    <img
                                        src={booking.Movie?.poster_url || booking.Showtime?.Movie?.poster_url || 'https://via.placeholder.com/100x150'}
                                        alt={booking.Movie?.title || 'Movie'}
                                    />
                                </div>

                                <div className="booking-card-info">
                                    <div className="booking-card-header">
                                        <h3>{booking.Movie?.title || booking.Showtime?.Movie?.title || 'Movie Title'}</h3>
                                        <span className={`booking-status status-${booking.status}`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="booking-card-details">
                                        <div className="detail-item">
                                            <Calendar size={14} />
                                            <span>{formatDate(booking.Showtime?.show_time, 'EEE, d MMM yyyy')}</span>
                                        </div>
                                        <div className="detail-item">
                                            <Clock size={14} />
                                            <span>{formatTime(booking.Showtime?.show_time)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <Ticket size={14} />
                                            <span>
                                                {booking.seats?.length || booking.BookingSeats?.length || 0} Ticket(s)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="booking-card-footer">
                                        <span className="booking-amount">
                                            {formatCurrency(booking.totalAmount || booking.total_amount)}
                                        </span>

                                        {activeTab === 'upcoming' && (
                                            <div className="booking-actions">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setCancelModal({ open: true, booking })}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel Modal */}
            <Modal
                isOpen={cancelModal.open}
                onClose={() => setCancelModal({ open: false, booking: null })}
                title="Cancel Booking"
                size="sm"
            >
                <div className="cancel-modal-content">
                    <XCircle size={48} className="cancel-icon" />
                    <p>Are you sure you want to cancel this booking?</p>
                    <p className="cancel-warning">This action cannot be undone.</p>

                    <div className="cancel-modal-actions">
                        <Button
                            variant="ghost"
                            onClick={() => setCancelModal({ open: false, booking: null })}
                        >
                            Keep Booking
                        </Button>
                        <Button
                            variant="danger"
                            loading={cancelling}
                            onClick={handleCancelBooking}
                        >
                            Cancel Booking
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
