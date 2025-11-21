const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users, businesses } = require('../data/mockData');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, phone, businessName, password, businessType } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.phone === phone);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user (in real app, save to database)
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      phone,
      businessName,
      password: hashedPassword,
      businessType,
      createdAt: new Date().toISOString(),
      isOnboarded: false
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        businessName: newUser.businessName,
        businessType: newUser.businessType,
        isOnboarded: newUser.isOnboarded
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password (in real app, compare with hashed password)
    // For demo purposes, we'll skip actual password verification
    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword) {
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName,
        businessType: user.businessType,
        isOnboarded: user.isOnboarded
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  const business = businesses[req.user.id];
  res.json({
    user: req.user,
    business: business || null
  });
});

// Complete onboarding
router.post('/onboarding/complete', authMiddleware, (req, res) => {
  try {
    const { businessHours, services, integrations } = req.body;
    
    // In a real app, update user's onboarding status and save business data
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex !== -1) {
      users[userIndex].isOnboarded = true;
    }

    res.json({
      message: 'Onboarding completed successfully',
      isOnboarded: true
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: 'Onboarding failed' });
  }
});

module.exports = router;