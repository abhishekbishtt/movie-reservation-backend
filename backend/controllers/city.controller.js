const { City } = require('../models');

/**
 * Get all active cities
 * @route GET /api/cities
 */
exports.getAllCities = async (req, res) => {
    try {
        const cities = await City.findAll({
            where: { is_active: true },
            attributes: ['id', 'name', 'state'],
            order: [['name', 'ASC']]
        });

        res.status(200).json({
            success: true,
            count: cities.length,
            data: cities
        });
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cities',
            error: error.message
        });
    }
};
