
const { Showtime, Movie, Hall, Theater, Seat, BookedSeats } = require("../models");
const { Op } = require('sequelize');


exports.getSeatAvailability = async (req, res) => {
  try {
    const { showtimeId } = req.params;

    if (!showtimeId) {
      return res.status(400).json({
        success: false,
        message: 'Showtime ID is required'
      });
    }


    const showtime = await Showtime.findByPk(showtimeId, {
      include: [
        {
          model: Movie,
          as: 'movie',
          attributes: ['id', 'title', 'duration']
        },
        {
          model: Hall,
          as: 'hall',
          attributes: ['id', 'name', 'total_rows', 'seats_per_row', 'screen_type'],
          include: [{
            model: Theater,
            as: 'theater',
            attributes: ['id', 'name']
          }]
        }
      ]
    });

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found'
      });
    }


    const allSeats = await Seat.findAll({
      where: {
        hall_id: showtime.hall_id,
        is_active: true
      },
      attributes: ['id', 'row_number', 'seat_number', 'seat_type', 'is_wheelchair_accessible'],
      order: [['row_number', 'ASC'], ['seat_number', 'ASC']]
    });


    const bookedSeats = await BookedSeats.findAll({
      where: {
        showtime_id: showtimeId,
        booking_status: { [Op.in]: ['reserved', 'confirmed'] }
      },
      attributes: ['seat_id', 'booking_status']
    });

    // Create a map of booked seat IDs for quick lookup
    const bookedSeatMap = new Map();
    bookedSeats.forEach(bs => {
      bookedSeatMap.set(bs.seat_id, bs.booking_status);
    });


    const seatsByRow = {};

    allSeats.forEach(seat => {
      const rowKey = `Row ${seat.row_number}`;

      if (!seatsByRow[rowKey]) {
        seatsByRow[rowKey] = [];
      }

      // Check if this seat is booked
      const bookingStatus = bookedSeatMap.get(seat.id);

      seatsByRow[rowKey].push({
        id: seat.id,
        seatNumber: seat.seat_number,
        rowNumber: seat.row_number,
        seatType: seat.seat_type,
        isWheelchairAccessible: seat.is_wheelchair_accessible,
        isAvailable: !bookingStatus,  // Available if not in bookedSeatMap
        status: bookingStatus || 'available'  // 'available', 'reserved', or 'confirmed'
      });
    });


    const basePrice = parseFloat(showtime.price);
    const pricing = {
      regular: basePrice,
      premium: basePrice * 1.5,  // 50% extra for premium seats
      wheelchair: basePrice       // Same price for wheelchair accessible
    };


    const totalSeats = allSeats.length;
    const unavailableSeats = bookedSeats.length;
    const availableSeats = totalSeats - unavailableSeats;

    res.status(200).json({
      success: true,
      message: 'Seat availability retrieved successfully',
      showtime: {
        id: showtime.id,
        movie: showtime.movie.title,
        hall: showtime.hall.name,
        theater: showtime.hall.theater.name,
        screenType: showtime.hall.screen_type,
        showDate: showtime.show_date,
        showTime: showtime.show_time
      },
      summary: {
        totalSeats,
        availableSeats,
        unavailableSeats
      },
      pricing,
      seats: seatsByRow
    });

  } catch (error) {
    console.error('Error fetching seat availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching seat availability'
    });
  }
};


exports.getShowtimesByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { date, cityId } = req.query;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID is required'
      });
    }

    // Default to today if no date provided
    const showDate = date || new Date().toISOString().split('T')[0];

    // Build where clause for showtime
    const whereClause = {
      movie_id: movieId,
      show_date: showDate,
      is_active: true
    };

    // Build include clause
    // If cityId is provided, filter theaters by city
    const theaterWhere = { is_active: true };
    if (cityId) {
      theaterWhere.city_id = cityId;
    }

    const showtimes = await Showtime.findAll({
      where: whereClause,
      include: [
        {
          model: Movie,
          as: 'movie',
          attributes: ['id', 'title', 'duration', 'age_rating', 'language']
        },
        {
          model: Hall,
          as: 'hall',
          attributes: ['id', 'name', 'screen_type', 'sound_system', 'total_seats'],
          include: [{
            model: Theater,
            as: 'theater',
            where: theaterWhere,
            attributes: ['id', 'name', 'address', 'imax_available', 'four_dx_available'],
            required: true
          }]
        }
      ],
      order: [['show_time', 'ASC']]
    });

    // Group showtimes by theater for easier frontend rendering
    const showtimesByTheater = {};

    showtimes.forEach(st => {
      const theaterName = st.hall.theater.name;

      if (!showtimesByTheater[theaterName]) {
        showtimesByTheater[theaterName] = {
          theater: {
            id: st.hall.theater.id,
            name: theaterName,
            address: st.hall.theater.address,
            hasImax: st.hall.theater.imax_available,
            has4DX: st.hall.theater.four_dx_available
          },
          showtimes: []
        };
      }

      showtimesByTheater[theaterName].showtimes.push({
        id: st.id,
        time: st.show_time,
        hall: st.hall.name,
        screenType: st.hall.screen_type,
        soundSystem: st.hall.sound_system,
        price: st.price,
        availableSeats: st.available_seats
      });
    });

    res.status(200).json({
      success: true,
      message: 'Showtimes retrieved successfully',
      movieId: movieId,
      date: showDate,
      count: showtimes.length,
      theaters: Object.values(showtimesByTheater)
    });

  } catch (error) {
    console.error('Error fetching showtimes by movie:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching showtimes'
    });
  }
};


exports.reserveSeats = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    const { seatIds } = req.body;

    // Validate input
    if (!showtimeId) {
      return res.status(400).json({
        success: false,
        message: 'Showtime ID is required'
      });
    }

    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one seat ID is required'
      });
    }

    if (seatIds.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 seats can be reserved at once'
      });
    }


    const showtime = await Showtime.findByPk(showtimeId, {
      include: [{
        model: Movie,
        as: 'movie',
        attributes: ['title']
      }]
    });

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found'
      });
    }

    // Check if showtime is in the future
    const showtimeDateTime = new Date(`${showtime.show_date}T${showtime.show_time}`);
    if (showtimeDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reserve seats for past showtimes'
      });
    }

    // Convert string seatIds to integers for database operations
    const seatIdsInt = seatIds.map(id => parseInt(id));


    const existingBookings = await BookedSeats.findAll({
      where: {
        showtime_id: showtimeId,
        seat_id: { [Op.in]: seatIdsInt },
        booking_status: { [Op.in]: ['reserved', 'confirmed'] }
      }
    });

    if (existingBookings.length > 0) {
      const unavailableSeatIds = existingBookings.map(b => b.seat_id);
      return res.status(409).json({
        success: false,
        message: 'Some seats are no longer available',
        unavailableSeats: unavailableSeatIds
      });
    }


    const seats = await Seat.findAll({
      where: {
        id: { [Op.in]: seatIdsInt },
        hall_id: showtime.hall_id,
        is_active: true
      }
    });

    if (seats.length !== seatIdsInt.length) {
      return res.status(400).json({
        success: false,
        message: 'Some seat IDs are invalid'
      });
    }


    const reservationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const basePrice = parseFloat(showtime.price);

    const bookingRecords = seatIdsInt.map(seatId => {
      const seat = seats.find(s => s.id === seatId);
      let seatPrice = basePrice;

      // Premium seats cost 50% more
      if (seat && seat.seat_type === 'premium') {
        seatPrice = basePrice * 1.5;
      }

      return {
        // id is auto-increment, do not set it manually
        seat_id: seatId,
        showtime_id: showtimeId,
        seat_price: seatPrice,
        booking_status: 'reserved',
        reserved_at: new Date()
      };
    });

    await BookedSeats.bulkCreate(bookingRecords);


    const totalAmount = bookingRecords.reduce((sum, br) => sum + br.seat_price, 0);

    res.status(200).json({
      success: true,
      message: 'Seats reserved successfully. Complete payment within 10 minutes.',
      reservation: {
        showtimeId: showtimeId,
        movie: showtime.movie.title,
        showDate: showtime.show_date,
        showTime: showtime.show_time,
        reservedSeats: seatIds,
        seatCount: seatIds.length,
        totalAmount: totalAmount,
        expiresAt: reservationExpiry
      }
    });

  } catch (error) {
    console.error('Error reserving seats:', error);
    res.status(500).json({
      success: false,
      message: 'Error reserving seats'
    });
  }
};


// Create a new showtime (Admin only)
exports.CreateShowtime = async (req, res) => {
  try {
    const { movieId } = req.params;  // Get movieId from URL params


    const {
      showDate,
      showTime,
      basePrice,
      availableSeats,
      hallId
    } = req.body;

    // Validate required fields
    if (!showDate || !showTime || !basePrice || !availableSeats || !hallId) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["showDate", "showTime", "basePrice", "availableSeats", "hallId"]
      });
    }

    // Verify movie exists
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Verify hall exists 
    if (hallId) {
      const hall = await Hall.findByPk(hallId);
      if (!hall) {
        return res.status(404).json({ message: "Hall not found" });
      }
    }

    // Create showtime with correct field mapping
    const newShowtime = await Showtime.create({
      movieId: parseInt(movieId),
      hallId: parseInt(hallId),
      showDate,
      showTime,
      basePrice: parseFloat(basePrice),
      availableSeats: parseInt(availableSeats),
      isActive: true
    });

    return res.status(201).json({
      message: "Showtime created successfully",
      showtime: newShowtime
    });

  } catch (error) {
    console.error("Showtime creation error:", error);

    //  Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }))
      });
    }

    return res.status(500).json({
      message: 'Error creating showtime'
    });
  }
};

// Get showtimes for a specific movie (Public access)
exports.getMovieShowtimes = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId || isNaN(movieId)) {
      return res.status(400).json({ message: 'Valid movie ID is required' });
    }

    //  Verify movie exists
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const showtimes = await Showtime.findAll({
      where: {
        movieId: movieId,
        isActive: true
      },
      include: [
        {
          model: Movie,
          as: 'movie',
          attributes: ['id', 'title', 'duration', 'certification', 'genre']
        },
        {
          model: Hall,
          as: 'hall',
          attributes: ['id', 'name', 'formatType', 'totalSeats'],
          include: [{
            model: Theater,
            as: 'theater',
            attributes: ['id', 'name', 'address', 'cityId']
          }]
        }
      ],
      order: [['showDate', 'ASC'], ['showTime', 'ASC']]
    });

    res.status(200).json({
      message: 'Showtimes retrieved successfully',
      movieId: parseInt(movieId),
      count: showtimes.length,
      showtimes
    });

  } catch (error) {
    console.error('Error fetching showtimes:', error);
    res.status(500).json({ message: 'Error fetching showtimes' });
  }
};

// Get all showtimes with filtering (Admin access)
exports.getAllShowtimes = async (req, res) => {
  try {
    const { date, movieId, hallId, theaterId } = req.query;

    //customhere clause for selecting only active showtimes
    const whereClause = { isActive: true };

    if (date) {
      whereClause.showDate = date;
    }

    if (movieId) {
      whereClause.movieId = movieId;
    }

    if (hallId) {
      whereClause.hallId = hallId;
    }

    //  include clause for theater filtering
    const includeClause = [
      { model: Movie, as: 'movie' },
      {
        model: Hall,
        as: 'hall',
        include: [{ model: Theater, as: 'theater' }]
      }
    ];

    if (theaterId) {
      includeClause[1].include[0].where = { id: theaterId };
    }

    const showtimes = await Showtime.findAll({
      where: whereClause,
      include: includeClause,
      order: [['showDate', 'ASC'], ['showTime', 'ASC']]
    });

    res.status(200).json({
      message: 'All showtimes retrieved successfully',
      filters: { date, movieId, hallId, theaterId },
      count: showtimes.length,
      showtimes
    });

  } catch (error) {
    console.error('Error fetching all showtimes:', error);
    res.status(500).json({ message: 'Error fetching showtimes' });
  }
};

// Get single showtime by ID (Public access)
exports.getShowtimeById = async (req, res) => {
  try {
    const { showtimeId } = req.params;

    if (!showtimeId || isNaN(showtimeId)) {
      return res.status(400).json({ message: 'Valid showtime ID is required' });
    }

    const showtime = await Showtime.findOne({
      where: {
        id: showtimeId,
        is_active: true
      },
      include: [
        { model: Movie, as: 'movie' },
        {
          model: Hall,
          as: 'hall',
          include: [{ model: Theater, as: 'theater' }]
        }
      ]
    });

    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    res.status(200).json({
      message: 'Showtime retrieved successfully',
      showtime
    });

  } catch (error) {
    console.error('Error fetching showtime:', error);
    res.status(500).json({ message: 'Error fetching showtime' });
  }
};

// Update showtime (Admin access)
exports.updateShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;

    if (!showtimeId || isNaN(showtimeId)) {
      return res.status(400).json({ message: 'Valid showtime ID is required' });
    }

    const showtime = await Showtime.findByPk(showtimeId);

    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // ✅ Extract updatable fields
    const {
      showDate,
      showTime,
      basePrice,
      availableSeats,
      hallId,
      isActive
    } = req.body;

    // ✅ Verify hall exists if hallId is being updated
    if (hallId && hallId !== showtime.hallId) {
      const hall = await Hall.findByPk(hallId);
      if (!hall) {
        return res.status(404).json({ message: "Hall not found" });
      }
    }

    // ✅ Build update object with only provided fields
    const updateFields = {};

    if (showDate !== undefined) updateFields.showDate = showDate;
    if (showTime !== undefined) updateFields.showTime = showTime;
    if (basePrice !== undefined) updateFields.basePrice = parseFloat(basePrice);
    if (availableSeats !== undefined) updateFields.availableSeats = parseInt(availableSeats);
    if (hallId !== undefined) updateFields.hallId = parseInt(hallId);
    if (isActive !== undefined) updateFields.isActive = isActive;

    await showtime.update(updateFields);

    // Fetch updated showtime with associations
    const updatedShowtime = await Showtime.findByPk(showtimeId, {
      include: [
        { model: Movie, as: 'movie' },
        {
          model: Hall,
          as: 'hall',
          include: [{ model: Theater, as: 'theater' }]
        }
      ]
    });

    res.status(200).json({
      message: 'Showtime updated successfully',
      showtime: updatedShowtime
    });

  } catch (error) {
    console.error('Showtime update error:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }))
      });
    }

    res.status(500).json({ message: 'Error updating showtime' });
  }
};

// Delete showtime - Soft delete (Admin access)
exports.deleteShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;

    if (!showtimeId || isNaN(showtimeId)) {
      return res.status(400).json({ message: 'Valid showtime ID is required' });
    }

    const showtime = await Showtime.findByPk(showtimeId);

    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Check if showtime has any reservations
    const { Reservation } = require('../models');
    const reservationCount = await Reservation.count({
      where: { showtimeId: showtimeId }
    });

    if (reservationCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete showtime with existing reservations',
        reservationCount
      });
    }

    // Soft delete - mark as inactive
    await showtime.update({ isActive: false });

    res.status(200).json({
      message: 'Showtime deleted successfully',
      showtimeId: showtime.id
    });

  } catch (error) {
    console.error('Showtime deletion error:', error);
    res.status(500).json({ message: 'Error deleting showtime' });
  }
};

// Permanent delete showtime (Admin access)
exports.permanentDeleteShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;

    if (!showtimeId || isNaN(showtimeId)) {
      return res.status(400).json({ message: 'Valid showtime ID is required' });
    }

    const showtime = await Showtime.findByPk(showtimeId);

    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Check if showtime has any reservations
    const { Reservation } = require('../models');
    const reservationCount = await Reservation.count({
      where: { showtimeId: showtimeId }
    });

    if (reservationCount > 0) {
      return res.status(400).json({
        message: 'Cannot permanently delete showtime with existing reservations',
        reservationCount
      });
    }

    await showtime.destroy();

    res.status(200).json({
      message: 'Showtime permanently deleted',
      showtimeId: parseInt(showtimeId)
    });

  } catch (error) {
    console.error('Showtime permanent deletion error:', error);
    res.status(500).json({ message: 'Error permanently deleting showtime' });
  }
};

// Get showtimes by date range (Public access)
exports.getShowtimesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, movieId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Start date and end date are required',
        format: 'YYYY-MM-DD'
      });
    }


    const whereClause = {
      isActive: true,
      showDate: {
        [require('sequelize').Op.between]: [startDate, endDate]
      }
    };

    if (movieId) {
      whereClause.movieId = movieId;
    }

    const showtimes = await Showtime.findAll({
      where: whereClause,
      include: [
        { model: Movie, as: 'movie' },
        {
          model: Hall,
          as: 'hall',
          include: [{ model: Theater, as: 'theater' }]
        }
      ],
      order: [['showDate', 'ASC'], ['showTime', 'ASC']]
    });

    res.status(200).json({
      message: 'Showtimes retrieved successfully',
      dateRange: { startDate, endDate },
      movieId: movieId || 'all',
      count: showtimes.length,
      showtimes
    });

  } catch (error) {
    console.error('Error fetching showtimes by date range:', error);
    res.status(500).json({ message: 'Error fetching showtimes' });
  }
};
