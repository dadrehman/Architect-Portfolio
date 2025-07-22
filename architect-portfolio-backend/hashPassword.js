const bcrypt = require('bcrypt');

async function generateHash() {
  try {
    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Generated hash for password123:', hashedPassword);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();