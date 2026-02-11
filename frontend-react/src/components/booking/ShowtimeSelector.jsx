import { motion } from 'framer-motion';
import { formatTime, formatCurrency } from '@utils/formatters';
import { MapPin } from 'lucide-react';
import './ShowtimeSelector.css';

export function ShowtimeSelector({ showtimes, selectedShowtime, onShowtimeSelect, loading }) {
    if (loading) {
        return (
            <div className="showtime-selector">
                <h3 className="showtime-selector-title">Select Showtime</h3>
                <div className="showtime-loading">
                    <div className="showtime-skeleton-theater">
                        <div className="skeleton" style={{ height: '24px', width: '200px' }} />
                        <div className="skeleton" style={{ height: '16px', width: '150px' }} />
                        <div className="showtime-skeleton-times">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="skeleton" style={{ height: '60px', width: '100px' }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!showtimes || !Array.isArray(showtimes) || showtimes.length === 0) {
        return (
            <div className="showtime-selector">
                <h3 className="showtime-selector-title">Select Showtime</h3>
                <div className="showtime-empty">
                    <p>No showtimes available for this date.</p>
                    <p className="showtime-empty-hint">Try selecting a different date.</p>
                </div>
            </div>
        );
    }

    // Group showtimes by theater/hall
    const groupedShowtimes = showtimes.reduce((acc, showtime) => {
        const theaterName = showtime.Hall?.Theater?.name || 'Theater';
        const hallName = showtime.Hall?.name || 'Screen';
        const key = `${theaterName} - ${hallName}`;

        if (!acc[key]) {
            acc[key] = {
                theater: theaterName,
                hall: hallName,
                address: showtime.Hall?.Theater?.address || '',
                showtimes: [],
            };
        }
        acc[key].showtimes.push(showtime);
        return acc;
    }, {});

    return (
        <div className="showtime-selector">
            <h3 className="showtime-selector-title">Select Showtime</h3>

            <div className="showtime-list">
                {Object.entries(groupedShowtimes).map(([key, group]) => (
                    <div key={key} className="showtime-group">
                        <div className="showtime-theater-info">
                            <h4 className="showtime-theater-name">{group.theater}</h4>
                            <span className="showtime-hall-name">{group.hall}</span>
                            {group.address && (
                                <span className="showtime-theater-address">
                                    <MapPin size={12} /> {group.address}
                                </span>
                            )}
                        </div>

                        <div className="showtime-times">
                            {group.showtimes.map((showtime) => {
                                const isSelected = selectedShowtime?.id === showtime.id;

                                return (
                                    <motion.button
                                        key={showtime.id}
                                        className={`showtime-pill ${isSelected ? 'selected' : ''}`}
                                        onClick={() => onShowtimeSelect(showtime)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="showtime-time">
                                            {formatTime(showtime.show_time)}
                                        </span>
                                        <span className="showtime-price">
                                            {formatCurrency(showtime.price)}
                                        </span>
                                        {showtime.available_seats !== undefined && (
                                            <span className="showtime-seats">
                                                {showtime.available_seats} seats
                                            </span>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
