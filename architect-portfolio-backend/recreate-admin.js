const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function recreateAdmin() {
  try {
    // Create a connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('Connected to database.');
    
    // Delete any existing admin
    await connection.execute('DELETE FROM admins WHERE email = ?', ['admin@example.com']);
    console.log('Deleted existing admin users.');
    
    // Create a new admin with current bcrypt version
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await connection.execute(
      'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
      ['admin', 'admin@example.com', hashedPassword]
    );
    
    console.log('Created new admin user with:');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    console.log('Hash:', hashedPassword);
    
    // Verify the hash can be compared correctly
    const isMatch = await bcrypt.compare('password123', hashedPassword);
    console.log('Verification test result:', isMatch);
    
    await connection.end();
    console.log('Done.');
  } catch (error) {
    console.error('Error:', error);
  }
}

recreateAdmin();