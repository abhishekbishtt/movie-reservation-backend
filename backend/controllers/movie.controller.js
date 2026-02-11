const { messaging } = require('firebase-admin');
const { Movie, Theater, Showtime, Hall, City } = require('../models');
const { Op } = require('sequelize');


exports.getFeaturedMovies = async (req, res) => {
  try {
    // Get featured movies (trending + now showing)
    const movies = await Movie.findAll({
      where: {
        is_active: true,
        is_trending: true  // Admin marks movies as trending
      },
      attributes: [
        'id',
        'title',
        'poster_url',
        'description',
        'genre',
        'duration',
        'age_rating',
        'rating',
        'language'
      ],
      order: [
        ['release_date', 'DESC']  // Newest first
      ],
      limit: 5  // Only top 5 for hero carousel
    });

    res.status(200).json({
      success: true,
      message: 'Featured movies retrieved successfully',
      count: movies.length,
      movies
    });

  } catch (error) {
    console.error('Error fetching featured movies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured movies'
    });
  }
};


exports.getMovies = async (req, res) => {
  try {
    // Extract query parameters
    const {
      genre,
      language,
      status,
      page = 1,
      limit = 20
    } = req.query;

    // Build where clause based on filters
    const whereClause = {
      is_active: true
    };

    // Add optional filters
    if (genre) {
      // genre is stored as array, check if it contains the filter value
      whereClause.genre = { [Op.contains]: [genre] };
    }

    if (language) {
      whereClause.language = language;
    }

    if (status) {
      // e.g., 'now_showing', 'coming_soon'
      whereClause.status = status;
    }

    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Fetch movies with pagination
    const { count, rows: movies } = await Movie.findAndCountAll({
      where: whereClause,
      attributes: [
        'id',
        'title',
        'poster_url',
        'genre',
        'duration',
        'age_rating',
        'rating',
        'language',
        'release_date'
      ],
      order: [
        ['release_date', 'DESC']
      ],
      limit: parseInt(limit),
      offset: offset
    });

    res.status(200).json({
      success: true,
      message: 'Movies retrieved successfully',
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalMovies: count,
        limit: parseInt(limit)
      },
      filters: { genre, language, status },
      movies
    });

  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching movies'
    });
  }
};


exports.createMovie = async (req, res) => {
  try {
    const {
      title,
      summary,           // ← Not 'description'
      genre,
      duration,          // ← Required
      language,
      release_date,      // ← Required  
      certification,     // ← Required
      status,
      posterImage,       // ← Required
      trailer_url,
      cast,
      crew,
      director,
      production_house,
      country_of_origin,
      is_active
    } = req.body;

    if (!title || !summary || !genre || !duration || !release_date || !posterImage) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['title', 'summary', 'genre', 'duration', 'release_date', 'posterImage']
      });
    }

    // ✅ Create movie with all extracted fields
    const movie = await Movie.create({
      title,
      summary,
      genre,
      duration,
      language: language || 'English',
      release_date,
      certification: certification || 'U',
      status: status || 'coming_soon',
      posterImage,
      trailer_url,
      cast,
      crew,
      director,
      production_house,
      country_of_origin: country_of_origin || 'India',
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({
      message: 'Movie created successfully',
      movie
    });

  } catch (error) {
    console.error('Movie creation error:', error);

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

    // ✅ Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        message: 'Movie with this title already exists'
      });
    }

    res.status(500).json({
      message: 'Error creating movie'
    });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    if (!movieId) {
      return res.status(400).json({
        message: 'Valid movie ID is required'
      });
    }

    const movie = await Movie.findOne({
      where: {
        id: movieId,
        is_active: true
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      message: 'Movie retrieved successfully',
      movie
    });

  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({
      message: 'Error fetching movie'
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({
        message: 'Valid movie ID is required'
      });
    }

    const movie = await Movie.findByPk(movieId);

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found'
      });
    }

    // ✅ Extract updatable fields
    const {
      title,
      summary,
      genre,
      duration,
      language,
      release_date,
      certification,
      status,
      posterImage,
      trailer_url,
      cast,
      crew,
      director,
      production_house,
      country_of_origin,
      is_active
    } = req.body;


    const updateFields = {};

    if (title !== undefined) updateFields.title = title;
    if (summary !== undefined) updateFields.summary = summary;
    if (genre !== undefined) updateFields.genre = genre;
    if (duration !== undefined) updateFields.duration = duration;
    if (language !== undefined) updateFields.language = language;
    if (release_date !== undefined) updateFields.release_date = release_date;
    if (certification !== undefined) updateFields.certification = certification;
    if (status !== undefined) updateFields.status = status;
    if (posterImage !== undefined) updateFields.posterImage = posterImage;
    if (trailer_url !== undefined) updateFields.trailer_url = trailer_url;
    if (cast !== undefined) updateFields.cast = cast;
    if (crew !== undefined) updateFields.crew = crew;
    if (director !== undefined) updateFields.director = director;
    if (production_house !== undefined) updateFields.production_house = production_house;
    if (country_of_origin !== undefined) updateFields.country_of_origin = country_of_origin;
    if (is_active !== undefined) updateFields.is_active = is_active;

    await movie.update(updateFields);

    res.status(200).json({
      message: 'Movie updated successfully',
      movie
    });

  } catch (error) {
    console.error('Movie update error:', error);

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

    res.status(500).json({
      message: 'Error updating movie'
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({
        message: 'Valid movie ID is required'
      });
    }

    const movie = await Movie.findByPk(movieId);

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found'
      });
    }

    // ✅ Soft delete - just mark as inactive
    await movie.update({ is_active: false });

    res.status(200).json({
      message: 'Movie deleted successfully',
      movieId: movie.id
    });

  } catch (error) {
    console.error('Movie deletion error:', error);
    res.status(500).json({
      message: 'Error deleting movie'
    });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    const { status, genre, language, city } = req.query;


    const whereClause = {
      is_active: true,
    }

    if (status) whereClause.status = status;
    if (genre) whereClause.genre = { [Op.iLike]: `%${genre}%` };
    if (language) whereClause.language = language;

    //
    const includeClause = city ? [
      {
        model: Showtime,
        as: model,
        include: [{
          model: Hall,
          as: 'hall',
          include: [{
            model: Theater,
            as: 'theater',
            where: { city: city, is_active: true }
          }]

        }],
        where: {
          is_active: true,
          showDate: { [Op.gte]: new Date.toISOString().split('T')[0] }
        },
        required: true
      }] : [];   //required true will make sure that no data is included that dont have hall and theater.


    const movies = await Movie.findAll(
      {
        where: whereClause,
        include: includeClause,
        order: [['release_date', 'DESC']],
        attributes: { exclude: ('createdAt', 'updatedAt') }

      }
    );
    res.status(200).json({
      message: 'Movies retrieved successfully',
      filters: { status, genre, language, city },
      count: movies.length,
      movies
    })
  }
  catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Error fetching movies' });
  }



}

exports.getTrendingMovie = async (req, res) => {
  try {

    const movies = await Movie.findAll({

      where: {
        status: 'now_showing',
        is_active: true,
      },
      attributes: ['id', 'title', 'genre', 'duration', 'certification', 'posterImage', 'release_date'],
      order: [['release_date', 'DESC']],
      limit: 20
    })

    res.status(200).json({
      message: 'Trending movies retrieved successfully',
      count: movies.length,
      movies
    });
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    res.status(500).json({ message: 'Error fetching movies' });
  }
}
exports.searchMovies = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 1) {
      return res.status(400).json({
        message: 'Search query is required'
      });

    }
    let whereClause;
    if (q.length === 1) {
      whereClause = {
        [Op.or]: [
          { title: { [Op.eq]: q } },
          { title: { [Op.eq]: `${q}%` } } // allow starting with that letter
        ],
        is_active: true

      }
    }
    else {
      whereClause = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { cast: { [Op.iLike]: `%${q}%` } }
        ],
        is_active: true
      }
    }

    const movies = await Movie.findAll(
      {
        where: whereClause,
        attributes: ['id', 'title', 'genre', 'duration', 'age_rating', 'poster_url'],
        order: [['title', 'ASC']], //order expects two things: first one is column on the basis you want to sort, secondly order asc or desc
        limit: q.length === 1 ? 5 : 10 // for single char 5 for multiple 10 search results

      })

    res.status(200).json({
      message: 'Movie search results',
      query: q,
      searchType: q.length === 1 ? 'exact/prefix' : 'fuzzy',
      count: movies.length,
      movies
    });
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ message: 'Error searching movies' });
  }
};



exports.getMovieTheaters = async (req, res) => {
  try {
    const { movieId, city } = req.params;
    const { date } = req.query;

    const showDate = date || new Date().toISOString().split('T')[0];

    // Verify movie exists
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const theaters = await Theater.findAll({
      where: {
        city: city,
        is_active: true
      },
      include: [{
        model: Hall,
        as: 'halls',
        include: [{
          model: Showtime,
          as: 'showtimes',
          where: {
            movieId: movieId,
            showDate: showDate,
            isActive: true
          },
          attributes: ['id', 'showTime', 'basePrice', 'availableSeats'],
          required: true
        }],
        required: true
      }],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      message: 'Theaters showing movie retrieved successfully',
      movie: { id: movie.id, title: movie.title },
      city,
      date: showDate,
      count: theaters.length,
      theaters
    });
  } catch (error) {
    console.error('Error fetching movie theaters:', error);
    res.status(500).json({ message: 'Error fetching theaters' });
  }
};

exports.getMovieShowtimes = async (req, res) => {
  try {
    const { movieId, city } = req.params;
    const { date } = req.query;

    const showDate = date || new Date().toISOString().split('T')[0];

    const showtimes = await Showtime.findAll({
      where: {
        movieId: movieId,
        showDate: showDate,
        isActive: true
      },
      include: [
        {
          model: Movie,
          as: 'movie',
          attributes: ['id', 'title', 'duration', 'age_rating']
        },
        {
          model: Hall,
          as: 'hall',
          include: [{
            model: Theater,
            as: 'theater',
            where: { city: city, is_active: true },
            attributes: ['id', 'name', 'address']
          }],
          attributes: ['id', 'name', 'formatType']
        }
      ],
      order: [['showTime', 'ASC']]
    });

    res.status(200).json({
      message: 'Movie showtimes retrieved successfully',
      movieId: parseInt(movieId),
      city,
      date: showDate,
      count: showtimes.length,
      showtimes
    });
  } catch (error) {
    console.error('Error fetching movie showtimes:', error);
    res.status(500).json({ message: 'Error fetching showtimes' });
  }
};


exports.getMoviesByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { date } = req.query;

    if (!cityId || isNaN(cityId)) {
      return res.status(400).json({ message: 'Valid city ID is required' });
    }

    const showDate = date || new Date().toISOString().split('T')[0];

    const movies = await Movie.findAll({
      where: { is_active: true },
      include: [{
        model: Showtime,
        as: 'showtimes',
        where: {
          show_date: showDate,
          is_active: true
        },
        include: [{
          model: Hall,
          as: 'hall',
          include: [{
            model: Theater,
            as: 'theater',
            where: {
              city_id: cityId,
              is_active: true
            },
            include: [{
              model: City,
              as: 'city',
              attributes: ['id', 'name', 'state']
            }]
          }]
        }],
        required: true
      }],
      order: [['title', 'ASC']]
    });

    res.status(200).json({
      message: 'Movies playing in city retrieved successfully',
      cityId: parseInt(cityId),
      date: showDate,
      count: movies.length,
      movies
    });
  } catch (error) {
    console.error('Error fetching movies by city:', error);
    res.status(500).json({ message: 'Error fetching movies' });
  }
};

