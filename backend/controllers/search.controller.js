

const { Movie } = require('../models');
const { Op } = require('sequelize');


exports.getSuggestions = async (req, res) => {
  try {
    // Get search query from URL parameter
    const { q, limit } = req.query;

    // Validate query
    if (!q || q.trim().length < 2) {
      // Need at least 2 characters for meaningful search
      return res.status(200).json({
        success: true,
        suggestions: []
      });
    }

    // Sanitize and prepare search term
    const searchTerm = q.trim().toLowerCase();
    const maxResults = Math.min(parseInt(limit) || 5, 10);  // Max 10 suggestions

    // Search for movies matching the query
    // Using iLike for case-insensitive partial matching (PostgreSQL)
    const movies = await Movie.findAll({
      where: {
        // Only search active movies
        is_active: true,
        // Match title that contains the search term
        title: {
          [Op.iLike]: `%${searchTerm}%`
        }
      },
      // Return minimal data for fast response
      attributes: ['id', 'title', 'poster_url', 'language', 'age_rating'],
      // Sort by relevance (movies starting with query first, then by title)
      order: [
        // This puts exact prefix matches first
        [
          Movie.sequelize.literal(
            `CASE WHEN LOWER(title) LIKE '${searchTerm}%' THEN 0 ELSE 1 END`
          ),
          'ASC'
        ],
        ['title', 'ASC']
      ],
      limit: maxResults
    });

    // Format response for autocomplete dropdown
    const suggestions = movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      posterUrl: movie.poster_url,
      language: movie.language,
      ageRating: movie.age_rating,
      // Generate URL for direct navigation
      url: `/movies/${movie.id}`
    }));

    res.status(200).json({
      success: true,
      query: q,
      count: suggestions.length,
      suggestions
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching search suggestions'
    });
  }
};


// =============================================================================
// BONUS: Advanced Search (if needed later)
// =============================================================================

