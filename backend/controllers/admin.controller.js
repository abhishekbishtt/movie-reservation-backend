const {
    User,
    Movie,
    Reservation,
    Payment,
    Showtime,
    Hall,
    Theater,
    City,
    BookedSeats,
    sequelize
} = require('../models');
const { Op } = require('sequelize');




exports.getAllUsers = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        // Optional search filter
        const { search, role } = req.query;
        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { firstName: { [Op.iLike]: `%${search}%` } },  // iLike = case-insensitive
                { lastName: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }

        if (role) {
            whereClause.role = role;
        }

        const { count, rows: users } = await User.findAndCountAll({
            where: whereClause,
            attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'createdAt', 'lastLogin'],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalUsers: count,
                limit
            },
            users
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password', 'reset_token', 'reset_token_expiry'] },
            include: [
                {
                    model: Reservation,
                    as: 'reservations',
                    limit: 10,
                    order: [['createdAt', 'DESC']],
                    include: [{
                        model: Showtime,
                        as: 'showtime',
                        include: [{ model: Movie, as: 'movie', attributes: ['title'] }]
                    }]
                },
                {
                    model: Payment,
                    as: 'payments',
                    limit: 10,
                    order: [['createdAt', 'DESC']]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Error fetching user details' });
    }
};




exports.createMovie = async (req, res) => {
    try {
        const {
            title, description, cast, director, genre,
            age_rating, duration, language, poster_url,
            release_date, is_trending, rating
        } = req.body;

        // Validate required fields
        if (!title || !age_rating || !duration || !release_date) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                required: ['title', 'age_rating', 'duration', 'release_date']
            });
        }

        // Generate a unique ID (or use UUID in production)
        const movieId = `movie_${Date.now()}`;

        const movie = await Movie.create({
            id: movieId,
            title,
            description,
            cast,
            director,
            genre: genre || [],
            age_rating,
            duration,
            language,
            poster_url,
            release_date,
            is_trending: is_trending || false,
            rating: rating || null,
            is_active: true
        });

        res.status(201).json({
            success: true,
            message: 'Movie created successfully',
            movie
        });

    } catch (error) {
        console.error('Movie creation error:', error);
        res.status(500).json({ success: false, message: 'Error creating movie' });
    }
};


exports.updateMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const updateData = req.body;

        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            return res.status(404).json({ success: false, message: 'Movie not found' });
        }

        await movie.update(updateData);

        res.status(200).json({
            success: true,
            message: 'Movie updated successfully',
            movie
        });

    } catch (error) {
        console.error('Movie update error:', error);
        res.status(500).json({ success: false, message: 'Error updating movie' });
    }
};


exports.deleteMovie = async (req, res) => {
    try {
        const { movieId } = req.params;

        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            return res.status(404).json({ success: false, message: 'Movie not found' });
        }

        // Soft delete - don't actually remove from database
        await movie.update({ is_active: false });

        res.status(200).json({
            success: true,
            message: 'Movie deleted successfully',
            movieId
        });

    } catch (error) {
        console.error('Movie deletion error:', error);
        res.status(500).json({ success: false, message: 'Error deleting movie' });
    }
};




exports.getAllBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { status, startDate, endDate } = req.query;
        const whereClause = {};

        if (status) {
            whereClause.status = status;
        }

        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const { count, rows: bookings } = await Reservation.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                },
                {
                    model: Showtime,
                    as: 'showtime',
                    include: [{
                        model: Movie,
                        as: 'movie',
                        attributes: ['id', 'title']
                    }]
                }
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalBookings: count,
                limit
            },
            bookings
        });

    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ success: false, message: 'Error fetching bookings' });
    }
};


exports.getBookingById = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Reservation.findByPk(bookingId, {
            include: [
                { model: User, as: 'user', attributes: { exclude: ['password'] } },
                {
                    model: Showtime,
                    as: 'showtime',
                    include: [
                        { model: Movie, as: 'movie' },
                        {
                            model: Hall,
                            as: 'hall',
                            include: [{ model: Theater, as: 'theater' }]
                        }
                    ]
                },
                { model: Payment, as: 'payment' }
            ]
        });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, booking });

    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ success: false, message: 'Error fetching booking' });
    }
};




exports.getAllPayments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { status } = req.query;
        const whereClause = status ? { status } : {};

        const { count, rows: payments } = await Payment.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
                { model: Reservation, as: 'reservation' }
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalPayments: count,
                limit
            },
            payments
        });

    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ success: false, message: 'Error fetching payments' });
    }
};


exports.getPaymentById = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findByPk(paymentId, {
            include: [
                { model: User, as: 'user', attributes: { exclude: ['password'] } },
                { model: Reservation, as: 'reservation' }
            ]
        });

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        res.status(200).json({ success: true, payment });

    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({ success: false, message: 'Error fetching payment' });
    }
};




exports.createShowtime = async (req, res) => {
    try {
        const { movie_id, hall_id, show_date, show_time, end_time, price, available_seats } = req.body;

        if (!movie_id || !hall_id || !show_date || !show_time || !price) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                required: ['movie_id', 'hall_id', 'show_date', 'show_time', 'price']
            });
        }

        // Verify movie and hall exist
        const movie = await Movie.findByPk(movie_id);
        const hall = await Hall.findByPk(hall_id);

        if (!movie) {
            return res.status(404).json({ success: false, message: 'Movie not found' });
        }

        if (!hall) {
            return res.status(404).json({ success: false, message: 'Hall not found' });
        }

        // Generate showtime ID
        const showtimeId = `showtime_${Date.now()}`;

        const showtime = await Showtime.create({
            id: showtimeId,
            movie_id,
            hall_id,
            show_date,
            show_time,
            end_time: end_time || show_time,  // Calculate based on movie duration
            price,
            available_seats: available_seats || hall.total_seats,
            is_active: true
        });

        res.status(201).json({
            success: true,
            message: 'Showtime created successfully',
            showtime
        });

    } catch (error) {
        console.error('Showtime creation error:', error);
        res.status(500).json({ success: false, message: 'Error creating showtime' });
    }
};


exports.updateShowtime = async (req, res) => {
    try {
        const { showtimeId } = req.params;

        const showtime = await Showtime.findByPk(showtimeId);

        if (!showtime) {
            return res.status(404).json({ success: false, message: 'Showtime not found' });
        }

        await showtime.update(req.body);

        res.status(200).json({
            success: true,
            message: 'Showtime updated successfully',
            showtime
        });

    } catch (error) {
        console.error('Showtime update error:', error);
        res.status(500).json({ success: false, message: 'Error updating showtime' });
    }
};


exports.deleteShowtime = async (req, res) => {
    try {
        const { showtimeId } = req.params;

        const showtime = await Showtime.findByPk(showtimeId);

        if (!showtime) {
            return res.status(404).json({ success: false, message: 'Showtime not found' });
        }

        await showtime.update({ is_active: false });

        res.status(200).json({
            success: true,
            message: 'Showtime deleted successfully',
            showtimeId
        });

    } catch (error) {
        console.error('Showtime deletion error:', error);
        res.status(500).json({ success: false, message: 'Error deleting showtime' });
    }
};


exports.getShowtimeBookings = async (req, res) => {
    try {
        const { showtimeId } = req.params;

        const showtime = await Showtime.findByPk(showtimeId, {
            include: [
                { model: Movie, as: 'movie', attributes: ['id', 'title'] },
                { model: Hall, as: 'hall', attributes: ['id', 'name', 'total_seats'] }
            ]
        });

        if (!showtime) {
            return res.status(404).json({ success: false, message: 'Showtime not found' });
        }

        const bookings = await Reservation.findAll({
            where: { showtime_id: showtimeId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });

        // Get booked seats count
        const bookedSeatsCount = await BookedSeats.count({
            where: {
                showtime_id: showtimeId,
                booking_status: { [Op.in]: ['reserved', 'confirmed'] }
            }
        });

        res.status(200).json({
            success: true,
            showtime: {
                id: showtime.id,
                movie: showtime.movie.title,
                hall: showtime.hall.name,
                showDate: showtime.show_date,
                showTime: showtime.show_time,
                totalSeats: showtime.hall.total_seats,
                bookedSeats: bookedSeatsCount,
                availableSeats: showtime.hall.total_seats - bookedSeatsCount
            },
            bookings
        });

    } catch (error) {
        console.error('Error fetching showtime bookings:', error);
        res.status(500).json({ success: false, message: 'Error fetching showtime bookings' });
    }
};




exports.getRevenue = async (req, res) => {
    try {
        const { startDate, endDate, groupBy } = req.query;

        // Default to last 30 days
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();

        // Get total revenue from completed payments
        const totalRevenue = await Payment.sum('amount', {
            where: {
                status: 'completed',
                paid_at: { [Op.between]: [start, end] }
            }
        });

        // Get count of completed payments
        const totalTransactions = await Payment.count({
            where: {
                status: 'completed',
                paid_at: { [Op.between]: [start, end] }
            }
        });

        // Get revenue by day (simplified - for production, use proper SQL grouping)
        const dailyRevenue = await Payment.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('paid_at')), 'date'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'revenue'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'transactions']
            ],
            where: {
                status: 'completed',
                paid_at: { [Op.between]: [start, end] }
            },
            group: [sequelize.fn('DATE', sequelize.col('paid_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('paid_at')), 'ASC']]
        });

        res.status(200).json({
            success: true,
            period: { start, end },
            summary: {
                totalRevenue: totalRevenue || 0,
                totalTransactions: totalTransactions || 0,
                averageTransactionValue: totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : 0
            },
            dailyBreakdown: dailyRevenue
        });

    } catch (error) {
        console.error('Error fetching revenue:', error);
        res.status(500).json({ success: false, message: 'Error fetching revenue analytics' });
    }
};


exports.getOccupancy = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();

        // Get showtimes in the period
        const showtimes = await Showtime.findAll({
            where: {
                show_date: { [Op.between]: [start, end] },
                is_active: true
            },
            include: [
                { model: Movie, as: 'movie', attributes: ['id', 'title'] },
                { model: Hall, as: 'hall', attributes: ['id', 'name', 'total_seats'] }
            ]
        });

        // Calculate occupancy for each showtime
        const occupancyData = await Promise.all(showtimes.map(async (showtime) => {
            const bookedCount = await BookedSeats.count({
                where: {
                    showtime_id: showtime.id,
                    booking_status: { [Op.in]: ['reserved', 'confirmed'] }
                }
            });

            return {
                showtimeId: showtime.id,
                movie: showtime.movie.title,
                hall: showtime.hall.name,
                showDate: showtime.show_date,
                showTime: showtime.show_time,
                totalSeats: showtime.hall.total_seats,
                bookedSeats: bookedCount,
                occupancyRate: ((bookedCount / showtime.hall.total_seats) * 100).toFixed(1)
            };
        }));

        // Calculate average occupancy
        const avgOccupancy = occupancyData.length > 0
            ? (occupancyData.reduce((sum, s) => sum + parseFloat(s.occupancyRate), 0) / occupancyData.length).toFixed(1)
            : 0;

        res.status(200).json({
            success: true,
            period: { start, end },
            summary: {
                totalShowtimes: occupancyData.length,
                averageOccupancy: avgOccupancy + '%'
            },
            showtimes: occupancyData
        });

    } catch (error) {
        console.error('Error fetching occupancy:', error);
        res.status(500).json({ success: false, message: 'Error fetching occupancy analytics' });
    }
};




exports.getAllHalls = async (req, res) => {
    try {
        const halls = await Hall.findAll({
            include: [{
                model: Theater,
                as: 'theater',
                attributes: ['id', 'name'],
                include: [{
                    model: City,
                    as: 'city',
                    attributes: ['id', 'name']
                }]
            }],
            order: [['name', 'ASC']]
        });

        res.status(200).json({
            success: true,
            count: halls.length,
            halls
        });

    } catch (error) {
        console.error('Error fetching halls:', error);
        res.status(500).json({ success: false, message: 'Error fetching halls' });
    }
};


exports.updateHall = async (req, res) => {
    try {
        const { hallId } = req.params;

        const hall = await Hall.findByPk(hallId);

        if (!hall) {
            return res.status(404).json({ success: false, message: 'Hall not found' });
        }

        await hall.update(req.body);

        res.status(200).json({
            success: true,
            message: 'Hall updated successfully',
            hall
        });

    } catch (error) {
        console.error('Hall update error:', error);
        res.status(500).json({ success: false, message: 'Error updating hall' });
    }
};
