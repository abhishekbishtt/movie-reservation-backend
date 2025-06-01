const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { BlackListedTokens } = require('../models');

exports.verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {

    const isBlacklisted = await BlackListedTokens.findOne({ where: { token } });
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token is expired, please login again.' });
    }
    if (Math.random() < 0.01) {
      BlackListedTokens.destroy({
        where: { expires_at: { [Op.lt]: new Date() } }
      }).catch(console.error)


    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Access denied, only admin allowed' });
  }
  next();
};