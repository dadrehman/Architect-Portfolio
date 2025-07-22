const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class Admin {
  // Get admin by id
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, email FROM admins WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error('Error fetching admin: ' + error.message);
    }
  }
  
  // Get admin by email
  static async getByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM admins WHERE email = ?',
        [email]
      );
      console.log('getByEmail result:', rows.length > 0 ? 'User found' : 'No user found', { email });
      return rows[0];
    } catch (error) {
      throw new Error('Error fetching admin: ' + error.message);
    }
  }
  
  // Create a new admin
  static async create(adminData) {
    const { username, email, password } = adminData;
    
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Insert admin into the database
      const [result] = await pool.execute(
        'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      
      return {
        id: result.insertId,
        username,
        email
      };
    } catch (error) {
      throw new Error('Error creating admin: ' + error.message);
    }
  }
  
  // Update admin
  static async update(id, adminData) {
    const { username, email, password } = adminData;
    
    try {
      // Check if the new email is already taken by another admin
      const [existingAdmins] = await pool.execute(
        'SELECT id FROM admins WHERE email = ? AND id != ?',
        [email, id]
      );
      
      if (existingAdmins.length > 0) {
        throw new Error('Email already exists');
      }

      // If password is provided, hash it
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        await pool.execute(
          'UPDATE admins SET username = ?, email = ?, password = ? WHERE id = ?',
          [username, email, hashedPassword, id]
        );
      } else {
        await pool.execute(
          'UPDATE admins SET username = ?, email = ? WHERE id = ?',
          [username, email, id]
        );
      }
      
      return {
        id,
        username,
        email
      };
    } catch (error) {
      if (error.message === 'Email already exists') {
        throw error; // Pass the specific error to the controller
      }
      throw new Error('Error updating admin: ' + error.message);
    }
  }
  
  // Login and generate JWT token
  static async login(email, password) {
    try {
      // Get admin by email
      console.log('Attempting to find admin with email:', email);
      const admin = await this.getByEmail(email);
      
      if (!admin) {
        console.log('Admin not found with email:', email);
        return null;
      }
      
      console.log('Found admin:', { id: admin.id, email: admin.email, username: admin.username });
      console.log('Stored password hash:', admin.password);
      console.log('Provided password:', password);
      
      // Check password
      const isMatch = await bcrypt.compare(password.trim(), admin.password);
      
      console.log('Password match result:', isMatch);
      
      if (!isMatch) {
        console.log('Password does not match for:', email);
        return null;
      }
      
      // Make sure JWT_SECRET is set
      if (!process.env.JWT_SECRET) {
        console.error('ERROR: JWT_SECRET is not set in environment variables');
        throw new Error('Server configuration error: JWT_SECRET is not set');
      }
      
      // Log the first few characters of JWT_SECRET for debugging
      console.log('JWT_SECRET first 3 chars:', process.env.JWT_SECRET.substring(0, 3));
      
      // Generate JWT token
      const token = jwt.sign(
        { id: admin.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );
      
      // Log the generated token (first 20 chars only for security)
      console.log('Generated token:', token.substring(0, 20) + '...');
      
      return {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        token
      };
    } catch (error) {
      console.error('Error in Admin.login:', error);
      throw new Error('Error logging in: ' + error.message);
    }
  }
}

module.exports = Admin;