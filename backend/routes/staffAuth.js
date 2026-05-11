const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const appConfig = require('../config/app');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await Staff.findOne({ where: { Email: email } });

    if (!staff) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, staff.PasswordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { staffId: staff.StaffID, email: staff.Email, role: staff.Role, type: 'staff' },
      appConfig.jwtSecret,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;