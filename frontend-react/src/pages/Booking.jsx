import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { movieService } from '@services/movieService';
import { showtimeService } from '@services/showtimeService';
import { bookingService } from '@services/bookingService';
import { formatDateForAPI } from '@utils/formatters';
import { getErrorMessage } from '@utils/helpers';
import { useBooking } from '@context/BookingContext';
import { DateSelector } from '@components/booking/DateSelector';
import { ShowtimeSelector } from '@components/booking/ShowtimeSelector';
import { SeatMap } from '@components/booking/SeatMap';
import { BookingSummary } from '@components/booking/BookingSummary';
import { PaymentSection } from '@components/booking/PaymentSection';
import { BookingConfirmation } from '@components/booking/BookingConfirmation';
import { Button } from '@components/common/Button';
import { PageLoader } from '@components/common/Loader';
import toast from 'react-hot-toast';
import './Booking.css';

const STEPS = [
    { id: 1, label: 'Select Showtime' },
    { id: 2, label: 'Select Seats' },
    { id: 3, label: 'Payment' },
    { id: 4, label: 'Confirmation' },
];

export default function Booking() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        movie,
        showtime,
        selectedDate,
        selectedSeats,
        reservation,
        payment,
        step,
        setMovie,
        setDate,
        setShowtime,
        setSeats,
        setReservation,
        setPayment,
        nextStep,
        prevStep,
        goToStep,
        reset,
    } = useBooking();

    const [showtimes, setShowtimes] = useState([]);
    const [seats, setSeatsData] = useState([]);
    const [loadingMovie, setLoadingMovie] = useState(true);
    const [loadingShowtimes, setLoadingShowtimes] = useState(false);
    const [loadingSeats, setLoadingSeats] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Initialize
    useEffect(() => {
        reset();
        const today = formatDateForAPI(new Date());
        setDate(today);
        fetchMovie();

        // Check if showtime was passed from MovieDetail
        if (location.state?.showtime) {
            setShowtime(location.state.showtime);
        }
    }, [movieId]);

    // Fetch showtimes when date changes
    useEffect(() => {
        if (movie && selectedDate) {
            fetchShowtimes();
        }
    }, [movie, selectedDate]);

    // Fetch seats when showtime is selected
    useEffect(() => {
        if (showtime) {
            fetchSeats();
        }
    }, [showtime]);

    const fetchMovie = async () => {
        try {
            setLoadingMovie(true);
            const response = await movieService.getMovieById(movieId);
            setMovie(response.movie || response);
        } catch (error) {
            toast.error('Movie not found');
            navigate('/movies');
        } finally {
            setLoadingMovie(false);
        }
    };

    const fetchShowtimes = async () => {
        try {
            setLoadingShowtimes(true);
            const response = await showtimeService.getShowtimesByMovie(movieId, selectedDate);
            setShowtimes(response.showtimes || response || []);
        } catch (error) {
            console.error('Error fetching showtimes:', error);
            setShowtimes([]);
        } finally {
            setLoadingShowtimes(false);
        }
    };

    const fetchSeats = async () => {
        try {
            setLoadingSeats(true);
            const response = await showtimeService.getSeatAvailability(showtime.id);
            setSeatsData(response.seats || response || []);
        } catch (error) {
            console.error('Error fetching seats:', error);
            setSeatsData([]);
        } finally {
            setLoadingSeats(false);
        }
    };

    const handleShowtimeSelect = (selectedShowtime) => {
        setShowtime(selectedShowtime);
    };

    const handleSeatSelect = (newSeats) => {
        setSeats(newSeats);
    };

    const handleProceedToPayment = async () => {
        if (selectedSeats.length === 0) {
            toast.error('Please select at least one seat');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await bookingService.createBooking({
                showtimeId: showtime.id,
                selectedSeats,
            });
            setReservation(response.booking || response);
            goToStep(3);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentSuccess = (paymentData) => {
        setPayment(paymentData);
        goToStep(4);
    };

    if (loadingMovie) {
        return <PageLoader text="Loading..." />;
    }

    const pricePerSeat = showtime?.price || 200;

    return (
        <div className="booking-page">
            <div className="container">
                {/* Header */}
                <div className="booking-header">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="booking-header-info">
                        <h1>{movie?.title}</h1>
                        <p>{movie?.language} • {movie?.age_rating}</p>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="booking-steps">
                    {STEPS.map((s, index) => (
                        <div
                            key={s.id}
                            className={`booking-step ${step >= s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}
                        >
                            <div className="step-number">
                                {step > s.id ? <Check size={16} /> : s.id}
                            </div>
                            <span className="step-label">{s.label}</span>
                            {index < STEPS.length - 1 && <div className="step-line" />}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="booking-content">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="booking-step-content"
                            >
                                <DateSelector
                                    selectedDate={selectedDate}
                                    onDateSelect={setDate}
                                />

                                <ShowtimeSelector
                                    showtimes={showtimes}
                                    selectedShowtime={showtime}
                                    onShowtimeSelect={handleShowtimeSelect}
                                    loading={loadingShowtimes}
                                />

                                {showtime && (
                                    <div className="booking-actions">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            rightIcon={<ArrowRight size={18} />}
                                            onClick={() => goToStep(2)}
                                        >
                                            Select Seats
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="booking-step-content booking-step-seats"
                            >
                                <div className="booking-seats-main">
                                    <SeatMap
                                        seats={seats}
                                        selectedSeats={selectedSeats}
                                        onSeatSelect={handleSeatSelect}
                                        maxSeats={10}
                                        pricePerSeat={pricePerSeat}
                                        loading={loadingSeats}
                                    />
                                </div>

                                <div className="booking-seats-sidebar">
                                    <BookingSummary
                                        movie={movie}
                                        showtime={showtime}
                                        selectedSeats={selectedSeats}
                                        pricePerSeat={pricePerSeat}
                                    />

                                    <div className="booking-actions-vertical">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            fullWidth
                                            loading={isProcessing}
                                            disabled={selectedSeats.length === 0}
                                            onClick={handleProceedToPayment}
                                        >
                                            Proceed to Payment
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            fullWidth
                                            onClick={() => goToStep(1)}
                                        >
                                            Change Showtime
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="booking-step-content booking-step-payment"
                            >
                                <div className="booking-payment-main">
                                    <PaymentSection
                                        reservation={reservation}
                                        movie={movie}
                                        showtime={showtime}
                                        selectedSeats={selectedSeats}
                                        pricePerSeat={pricePerSeat}
                                        onPaymentSuccess={handlePaymentSuccess}
                                    />
                                </div>

                                <div className="booking-payment-sidebar">
                                    <BookingSummary
                                        movie={movie}
                                        showtime={showtime}
                                        selectedSeats={selectedSeats}
                                        pricePerSeat={pricePerSeat}
                                        showBreakdown={false}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="booking-step-content"
                            >
                                <BookingConfirmation
                                    booking={{ ...reservation, seats: selectedSeats }}
                                    movie={movie}
                                    showtime={showtime}
                                    payment={payment}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
