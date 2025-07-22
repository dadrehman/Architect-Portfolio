const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetAdmin() {
  console.log('Starting admin reset...');
  
  // Create a new connection (don't use the pool to avoid any issues)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  try {
    console.log('Connected to database');
    
    // Delete existing admin
    await connection.execute('DELETE FROM admins WHERE email = ?', ['admin@example.com']);
    console.log('Deleted existing admin');
    
    // Create new password hash
    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Created password hash');
    
    // Insert new admin
    await connection.execute(
      'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
      ['admin', 'admin@example.com', hashedPassword]
    );
    console.log('Created new admin user');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    
    console.log('Admin reset completed successfully');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
    process.exit(0);
  }
}

resetAdmin();