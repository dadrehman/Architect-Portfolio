// routes/admin.js - COMPLETE CODE
const express = require('express');
const { login, getMe, updateDetails, updatePassword } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimit');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Initialize router
const router = express.Router();

// Public routes
router.post('/login', login);

// Verify token endpoint
router.post('/verify-token', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // Print the token and secret (first few chars) for debugging
    console.log('Token to verify:', token.substring(0, 20) + '...');
    console.log('JWT_SECRET first 3 chars:', process.env.JWT_SECRET.substring(0, 3));
    
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET);
    
    // If verification passes, token is valid
    return res.status(200).json({
      success: true,
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    // Provide specific error details
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Error verifying token'
      });
    }
  }
});

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateDetails);
router.put('/password', protect, updatePassword);

module.exports = router;