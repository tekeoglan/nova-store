const jwt = require('jsonwebtoken');
const appConfig = require('../config/app');

const staffAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  jwt.verify(token, appConfig.jwtSecret, (err, staff) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    if (staff.type !== 'staff') {
      return res.status(401).json({ message: 'Staff access required' });
    }
    req.staff = staff;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.staff.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { staffAuth, isAdmin };