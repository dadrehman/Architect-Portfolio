// middleware/auth.js - COMPLETE CODE
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    // Print all headers for debugging
    console.log('Request headers:', req.headers);
    
    let token;
    
    // Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token from header:', token.substring(0, 20) + '...');
    } else {
      console.log('No Authorization header with Bearer token found');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    // Check if token exists
    if (!token) {
      console.log('No token extracted from Authorization header');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Print JWT_SECRET first characters (for debugging)
    console.log('JWT_SECRET first 3 chars:', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 3) : 'not set');
    
    try {
      // Verify token
      console.log('Attempting to verify token...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified successfully. Decoded user ID:', decoded.id);
      
      // Get admin from database
      console.log('Fetching admin data from database...');
      const [rows] = await pool.execute(
        'SELECT id, username, email FROM admins WHERE id = ?',
        [decoded.id]
      );
      
      if (rows.length === 0) {
        console.log('No admin found with ID:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Set req.admin to the admin data
      req.admin = rows[0];
      console.log('Admin authenticated:', req.admin.username);
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      // Provide more detailed error for debugging
      if (error.name === 'JsonWebTokenError') {
        console.error('Invalid token format or signature');
      } else if (error.name === 'TokenExpiredError') {
        console.error('Token has expired');
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};