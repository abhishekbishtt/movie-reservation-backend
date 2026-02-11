import { motion } from 'framer-motion';
import { formatCurrency } from '@utils/formatters';
import './SeatMap.css';

export function SeatMap({
    seats = [],
    selectedSeats = [],
    onSeatSelect,
    maxSeats = 10,
    pricePerSeat = 0,
    loading = false,
}) {
    if (loading) {
        return (
            <div className="seat-map-container">
                <div className="screen">
                    <div className="screen-curve"></div>
                    <span>SCREEN</span>
                </div>
                <div className="seat-map-loading">Loading seats...</div>
            </div>
        );
    }

    if (!seats || seats.length === 0) {
        return (
            <div className="seat-map-container">
                <div className="screen">
                    <div className="screen-curve"></div>
                    <span>SCREEN</span>
                </div>
                <div className="seat-map-empty">No seat data available</div>
            </div>
        );
    }

    // Group seats by row
    const seatsByRow = seats.reduce((acc, seat) => {
        const rowLabel = String.fromCharCode(64 + seat.row_number); // 1 -> A, 2 -> B
        if (!acc[rowLabel]) acc[rowLabel] = [];
        acc[rowLabel].push(seat);
        return acc;
    }, {});

    const rows = Object.keys(seatsByRow).sort();

    const handleSeatClick = (seat) => {
        if (seat.status === 'booked' || seat.status === 'reserved') return;

        const seatId = `${String.fromCharCode(64 + seat.row_number)}${seat.seat_number}`;
        const isSelected = selectedSeats.includes(seatId);

        if (isSelected) {
            onSeatSelect(selectedSeats.filter((s) => s !== seatId));
        } else if (selectedSeats.length < maxSeats) {
            onSeatSelect([...selectedSeats, seatId]);
        }
    };

    const getSeatStatus = (seat) => {
        const seatId = `${String.fromCharCode(64 + seat.row_number)}${seat.seat_number}`;
        if (seat.status === 'booked' || seat.status === 'reserved') return 'booked';
        if (selectedSeats.includes(seatId)) return 'selected';
        if (seat.seat_type === 'premium') return 'premium';
        if (seat.seat_type === 'wheelchair') return 'wheelchair';
        return 'available';
    };

    return (
        <div className="seat-map-container">
            <div className="screen">
                <div className="screen-curve"></div>
                <span>SCREEN</span>
            </div>

            <div className="seat-grid">
                {rows.map((row) => (
                    <div key={row} className="seat-row">
                        <span className="row-label">{row}</span>
                        <div className="seats">
                            {seatsByRow[row]
                                .sort((a, b) => a.seat_number - b.seat_number)
                                .map((seat) => {
                                    const status = getSeatStatus(seat);
                                    const seatId = `${row}${seat.seat_number}`;

                                    return (
                                        <motion.button
                                            key={seat.id}
                                            className={`seat seat-${status}`}
                                            onClick={() => handleSeatClick(seat)}
                                            disabled={status === 'booked'}
                                            whileHover={status !== 'booked' ? { scale: 1.15 } : {}}
                                            whileTap={status !== 'booked' ? { scale: 0.95 } : {}}
                                            title={`Seat ${seatId} - ${status}`}
                                        >
                                            {seat.seat_number}
                                        </motion.button>
                                    );
                                })}
                        </div>
                        <span className="row-label">{row}</span>
                    </div>
                ))}
            </div>

            <SeatLegend />

            {selectedSeats.length > 0 && (
                <div className="selection-summary">
                    <div className="selection-seats">
                        <span>Selected: </span>
                        <strong>{selectedSeats.sort().join(', ')}</strong>
                    </div>
                    <div className="selection-total">
                        <span>Total: </span>
                        <strong>{formatCurrency(selectedSeats.length * pricePerSeat)}</strong>
                    </div>
                </div>
            )}

            {selectedSeats.length >= maxSeats && (
                <p className="seat-limit-warning">
                    Maximum {maxSeats} seats can be selected per booking
                </p>
            )}
        </div>
    );
}

function SeatLegend() {
    return (
        <div className="seat-legend">
            <div className="legend-item">
                <span className="seat-demo seat-available"></span>
                <span>Available</span>
            </div>
            <div className="legend-item">
                <span className="seat-demo seat-selected"></span>
                <span>Selected</span>
            </div>
            <div className="legend-item">
                <span className="seat-demo seat-booked"></span>
                <span>Booked</span>
            </div>
            <div className="legend-item">
                <span className="seat-demo seat-premium"></span>
                <span>Premium</span>
            </div>
        </div>
    );
}
