

const {
    Reservation,
    Showtime,
    Movie,
    Hall,
    Theater,
    City,
    User,
    BookedSeats,
    Payment,
    Seat,
    sequelize
} = require('../models');
const { Op } = require('sequelize');


exports.createBooking = async (req, res, next) => {

    const transaction = await sequelize.transaction();

    try {
        const userId = req.user.id; // user id decoded from auth middleware
        const { showtimeId: showtimeIdStr, selectedSeats: selectedSeatsStr } = req.body;
        const showtimeId = parseInt(showtimeIdStr);
        const selectedSeats = selectedSeatsStr.map(s => parseInt(s));

        // Get showtime details
        const showtime = await Showtime.findByPk(showtimeId, {
            include: [{
                model: Movie,
                as: 'movie',
                attributes: ['id', 'title', 'duration']
            }],
            transaction // it ensures that the query runs within the transaction in other words it ensures if transaction fails then this query will also be rolled back
        });

        if (!showtime) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Showtime not found'
            });
        }

        // Check if showtime is in the future
        const showtimeDateTime = new Date(`${showtime.show_date}T${showtime.show_time}`);

        if (showtimeDateTime < new Date()) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cannot book seats for past showtimes'
            });
        }

        // Check seat availability with row lock
        const existingBookings = await BookedSeats.findAll({
            where: {
                showtime_id: showtimeId,
                seat_id: { [Op.in]: selectedSeats },
                booking_status: { [Op.in]: ['reserved', 'confirmed'] }
            },
            lock: transaction.LOCK.UPDATE,
            transaction
        });

        if (existingBookings.length > 0) {
            await transaction.rollback();
            const bookedSeatIds = existingBookings.map(b => b.seat_id);
            return res.status(409).json({
                success: false,
                message: 'Some selected seats are no longer available',
                unavailableSeats: bookedSeatIds
            });
        }

        // Fetch actual seat details to get seat_type for dynamic pricing
        const seatDetails = await Seat.findAll({
            where: { id: { [Op.in]: selectedSeats } },
            attributes: ['id', 'seat_type'],
            transaction
        });

        // Create a map for quick lookup: seatId -> seat_type
        const seatTypeMap = {};
        seatDetails.forEach(seat => {
            seatTypeMap[seat.id] = seat.seat_type;
        });

        // Pricing config: base price from showtime + premium fee if applicable
        const PREMIUM_FEE = 100; // ₹100 extra for premium seats
        const basePrice = parseFloat(showtime.price);

        // Calculate individual seat prices and total
        let seatsTotal = 0;
        const bookedSeatsData = selectedSeats.map(seatId => {
            const seatType = seatTypeMap[seatId] || 'regular';
            const seatPrice = seatType === 'premium'
                ? basePrice + PREMIUM_FEE
                : basePrice;
            seatsTotal += seatPrice;

            return {
                seat_id: seatId,
                showtime_id: showtimeId,
                seat_price: seatPrice,
                booking_status: 'reserved'
            };
        });

        const seatCount = selectedSeats.length;
        const convenienceFee = 30 * seatCount; // ₹30 per seat
        const totalAmount = seatsTotal + convenienceFee;

        // Create reservation
        const reservation = await Reservation.create({
            user_id: userId,
            showtime_id: showtimeId,
            selected_seats: selectedSeats,
            seat_count: seatCount,
            total_amount: totalAmount,
            convenience_fee: convenienceFee,
            status: 'pending',
            expires_at: new Date(Date.now() + 10 * 60 * 1000)
        }, { transaction });

        await BookedSeats.bulkCreate(bookedSeatsData, { transaction });

        // Commit transaction
        await transaction.commit();

        res.status(201).json({
            success: true,
            message: 'Booking created. Please complete payment within 10 minutes.',
            booking: {
                id: reservation.id,
                movie: showtime.movie.title,
                showDate: showtime.show_date,
                showTime: showtime.show_time,
                selectedSeats: selectedSeats,
                seatCount: seatCount,
                totalAmount: totalAmount,
                convenienceFee: convenienceFee,
                status: reservation.status,
                expiresAt: reservation.expires_at
            }
        });

    } catch (error) {
        // Rollback if any error
        await transaction.rollback();
        next(error);
    }
};


exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;  // Optional filter: ?status=confirmed

        // Build where clause
        const whereClause = { user_id: userId };
        if (status) {
            whereClause.status = status;
        }

        // Fetch reservations with related data
        const reservations = await Reservation.findAll({
            where: whereClause,
            include: [{
                model: Showtime,
                as: 'showtime',
                include: [
                    {
                        model: Movie,
                        as: 'movie',
                        attributes: ['id', 'title', 'poster_url', 'duration', 'language']
                    },
                    {
                        model: Hall,
                        as: 'hall',
                        attributes: ['id', 'name', 'screen_type'],
                        include: [{
                            model: Theater,
                            as: 'theater',
                            attributes: ['id', 'name', 'address'],
                            include: [{
                                model: City,
                                as: 'city',
                                attributes: ['id', 'name']
                            }]
                        }]
                    }
                ]
            }],
            order: [['createdAt', 'DESC']]  // Most recent first
        });

        // Format response for easier frontend consumption
        const formattedBookings = reservations.map(reservation => ({
            id: reservation.id,
            status: reservation.status,
            seats: reservation.selected_seats,
            seatCount: reservation.seat_count,
            totalAmount: reservation.total_amount,
            bookedAt: reservation.createdAt,
            confirmedAt: reservation.confirmed_at,
            movie: {
                id: reservation.showtime.movie.id,
                title: reservation.showtime.movie.title,
                posterUrl: reservation.showtime.movie.poster_url,
                duration: reservation.showtime.movie.duration,
                language: reservation.showtime.movie.language
            },
            showtime: {
                date: reservation.showtime.show_date,
                time: reservation.showtime.show_time
            },
            theater: {
                name: reservation.showtime.hall.theater.name,
                address: reservation.showtime.hall.theater.address,
                city: reservation.showtime.hall.theater.city.name,
                hall: reservation.showtime.hall.name,
                screenType: reservation.showtime.hall.screen_type
            }
        }));

        res.status(200).json({
            success: true,
            count: formattedBookings.length,
            bookings: formattedBookings
        });

    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        });
    }
};


exports.getBookingById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookingId } = req.params;

        const reservation = await Reservation.findOne({
            where: {
                id: bookingId,
                user_id: userId  // Ensures users can only see their own bookings
            },
            include: [
                {
                    model: Showtime,
                    as: 'showtime',
                    include: [
                        {
                            model: Movie,
                            as: 'movie',
                            attributes: ['id', 'title', 'poster_url', 'duration', 'language', 'age_rating']
                        },
                        {
                            model: Hall,
                            as: 'hall',
                            include: [{
                                model: Theater,
                                as: 'theater',
                                include: [{
                                    model: City,
                                    as: 'city'
                                }]
                            }]
                        }
                    ]
                },
                {
                    model: Payment,
                    as: 'payment'
                }
            ]
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            booking: reservation
        });

    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking details'
        });
    }
};


exports.cancelBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookingId } = req.params;
        const { reason } = req.body;


        const reservation = await Reservation.findOne({
            where: {
                id: bookingId,
                user_id: userId
            },
            include: [{
                model: Showtime,
                as: 'showtime'
            }]
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }


        if (reservation.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }


        const showtimeDateTime = new Date(
            `${reservation.showtime.show_date}T${reservation.showtime.show_time}`
        );

        if (showtimeDateTime < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel past bookings'
            });
        }


        await reservation.update({
            status: 'cancelled',
            cancellation_reason: reason || 'User requested cancellation',
            cancelled_by: 'user'
        });


        await BookedSeats.update(
            { booking_status: 'cancelled' },
            {
                where: {
                    showtime_id: reservation.showtime_id,
                    seat_id: { [Op.in]: reservation.selected_seats }
                }
            }
        );



        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            bookingId: bookingId,
            refundStatus: reservation.status === 'confirmed' ? 'Refund will be processed' : 'No refund needed'
        });

    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking'
        });
    }
};


exports.getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        // Verify user exists
        const user = await User.findByPk(userId, {
            attributes: ['id', 'firstName', 'lastName', 'email']
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Fetch user's reservations
        const reservations = await Reservation.findAll({
            where: { user_id: userId },
            include: [{
                model: Showtime,
                as: 'showtime',
                include: [
                    {
                        model: Movie,
                        as: 'movie',
                        attributes: ['id', 'title']
                    }
                ]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            user: user,
            count: reservations.length,
            bookings: reservations
        });

    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user bookings'
        });
    }
};
