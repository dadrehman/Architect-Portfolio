// debug-token.js - Run with: node debug-token.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to create a test token
function createTestToken() {
  if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET is not set in environment variables');
    process.exit(1);
  }
  
  console.log('Using JWT_SECRET:', process.env.JWT_SECRET);
  
  try {
    const payload = {
      id: 1,
      username: 'admin',
      email: 'admin@example.com'
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
    
    console.log('\nGenerated test token:');
    console.log(token);
    
    // Verify the token
    console.log('\nVerifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully!');
    console.log('Decoded payload:', decoded);
    
    return token;
  } catch (error) {
    console.error('Error creating/verifying token:', error.message);
    return null;
  }
}

// Create and verify a test token
const testToken = createTestToken();

// Provide instructions for using this token
if (testToken) {
  console.log('\n----------------------------------------------------');
  console.log('HOW TO USE THIS TOKEN FOR MANUAL TESTING:');
  console.log('----------------------------------------------------');
  console.log('1. Copy this token');
  console.log('2. In your browser localStorage, set a key "architecture_admin_token" with this token as the value');
  console.log('3. Refresh your application and try to create a project');
  console.log('----------------------------------------------------');
}