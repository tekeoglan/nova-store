const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const Customer = require('../models/Customer');
const User = require('../models/User');
const appConfig = require('../config/app');

// Register
router.post('/signup', async (req, res) => {
  try {
    const { username, password, fullName, email } = req.body;

    const existingUser = await User.findOne({ where: { Username: username } });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    const existingCustomer = await Customer.findOne({ where: { Email: email } });
    if (existingCustomer) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sequelize.transaction(async (t) => {
      const customer = await Customer.create({
        FullName: fullName,
        Email: email,
      }, { transaction: t });

      const user = await User.create({
        Username: username,
        PasswordHash: hashedPassword,
        CustomerID: customer.CustomerID,
      }, { transaction: t });

      return { customerId: customer.CustomerID, userId: user.UserID };
    });

    res.status(201).json({ message: 'User registered successfully', customerId: result.customerId, userId: result.userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { Username: username } });

    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign({ userId: user.UserID, username: user.Username }, appConfig.jwtSecret, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
