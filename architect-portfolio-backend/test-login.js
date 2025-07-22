const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

// Create a new connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create admin user route
app.post('/create-admin', async (req, res) => {
  try {
    // Hash the password
    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // First delete any existing admin
    await pool.execute('DELETE FROM admins WHERE email = ?', ['admin@example.com']);
    
    // Insert admin into the database
    const [result] = await pool.execute(
      'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
      ['admin', 'admin@example.com', hashedPassword]
    );
    
    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: result.insertId,
        username: 'admin',
        email: 'admin@example.com',
        passwordUsed: 'password123'
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Test login route
app.post('/test-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Get admin by email
    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE email = ?',
      [email]
    );
    
    if (rows.length === 0) {
      console.log('No admin found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const admin = rows[0];
    console.log('Admin found:', { id: admin.id, username: admin.username, email: admin.email });
    console.log('Password from DB:', admin.password);
    console.log('Password from request:', password);
    
    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(200).json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        token
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Start server
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Create admin: http://localhost:${PORT}/create-admin`);
  console.log(`Test login: http://localhost:${PORT}/test-login`);
});