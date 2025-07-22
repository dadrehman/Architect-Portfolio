const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugLogin() {
  console.log('Starting login debugging...');
  
  try {
    // Create a connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('Connected to database.');
    
    // Step 1: Check if admin user exists
    const [rows] = await connection.execute(
      'SELECT * FROM admins WHERE email = ?',
      ['admin@example.com']
    );
    
    if (rows.length === 0) {
      console.log('ERROR: Admin user does not exist!');
      return;
    }
    
    console.log('Admin user found:', rows[0]);
    
    // Step 2: Test password match
    const isMatch = await bcrypt.compare('password123', rows[0].password);
    console.log('Password matches:', isMatch);
    
    if (!isMatch) {
      // Create a new password hash for verification
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      console.log('Expected hash pattern:', hashedPassword);
      console.log('Actual stored hash:', rows[0].password);
      
      // Create new admin with correct password
      console.log('Creating a new admin user with correct password hash...');
      
      // Delete existing admin
      await connection.execute('DELETE FROM admins WHERE email = ?', ['admin@example.com']);
      
      // Create new admin
      const newSalt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash('password123', newSalt);
      
      await connection.execute(
        'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
        ['admin', 'admin@example.com', newHashedPassword]
      );
      
      console.log('New admin created with username: admin, email: admin@example.com, password: password123');
      console.log('Try logging in again with these credentials.');
    } else {
      console.log('Authentication should work. There might be an issue with the login API.');
    }
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

debugLogin();