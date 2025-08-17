const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'Token is not valid. User not found.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired.',
      });
    }

    res.status(500).json({
      message: 'Server error in authentication.',
    });
  }
};

const admin = (req, res, next) => {
  console.log(req);
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied. Admin role required.',
    });
  }
};

const adminOrOwner = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'admin' || req.user._id.toString() === req.params.id)
  ) {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied. Insufficient permissions.',
    });
  }
};

module.exports = {
  protect,
  admin,
  adminOrOwner,
};
