import { formatCurrency, formatDate, formatTime } from '@utils/formatters';
import { CONVENIENCE_FEE_PERCENT } from '@utils/constants';
import { Film, Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import './BookingSummary.css';

export function BookingSummary({
    movie,
    showtime,
    selectedSeats,
    pricePerSeat,
    showBreakdown = true
}) {
    const subtotal = selectedSeats.length * pricePerSeat;
    const convenienceFee = Math.round(subtotal * (CONVENIENCE_FEE_PERCENT - 1));
    const total = subtotal + convenienceFee;

    return (
        <div className="booking-summary">
            <h3 className="booking-summary-title">Booking Summary</h3>

            {/* Movie Info */}
            <div className="booking-summary-movie">
                {movie?.poster_url && (
                    <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="booking-summary-poster"
                    />
                )}
                <div className="booking-summary-movie-info">
                    <h4>{movie?.title}</h4>
                    <p>{movie?.language} • {movie?.age_rating}</p>
                </div>
            </div>

            {/* Details */}
            <div className="booking-summary-details">
                {showtime && (
                    <>
                        <div className="booking-summary-item">
                            <Calendar size={16} />
                            <span>{formatDate(showtime.show_time, 'EEEE, d MMMM yyyy')}</span>
                        </div>
                        <div className="booking-summary-item">
                            <Clock size={16} />
                            <span>{formatTime(showtime.show_time)}</span>
                        </div>
                        {showtime.Hall && (
                            <div className="booking-summary-item">
                                <MapPin size={16} />
                                <span>
                                    {showtime.Hall.Theater?.name || 'Theater'} - {showtime.Hall.name}
                                </span>
                            </div>
                        )}
                    </>
                )}

                {selectedSeats.length > 0 && (
                    <div className="booking-summary-item">
                        <Ticket size={16} />
                        <span>
                            {selectedSeats.length} Ticket{selectedSeats.length > 1 ? 's' : ''}: {selectedSeats.sort().join(', ')}
                        </span>
                    </div>
                )}
            </div>

            {/* Price Breakdown */}
            {showBreakdown && selectedSeats.length > 0 && (
                <div className="booking-summary-price">
                    <div className="price-row">
                        <span>Tickets ({selectedSeats.length} × {formatCurrency(pricePerSeat)})</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="price-row">
                        <span>Convenience Fee</span>
                        <span>{formatCurrency(convenienceFee)}</span>
                    </div>
                    <div className="price-row price-total">
                        <span>Total Amount</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
