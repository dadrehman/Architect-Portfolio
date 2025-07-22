// Save this as check-uploads.js in your backend root folder

const fs = require('fs');
const path = require('path');

// Paths to check
const uploadsDir = path.join(__dirname, 'uploads');
const projectsDir = path.join(uploadsDir, 'projects');

// Check and create uploads directory
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory...');
  try {
    fs.mkdirSync(uploadsDir);
    console.log('uploads directory created successfully');
  } catch (error) {
    console.error('Failed to create uploads directory:', error.message);
    process.exit(1);
  }
} else {
  console.log('uploads directory exists');
}

// Check and create projects directory
if (!fs.existsSync(projectsDir)) {
  console.log('Creating uploads/projects directory...');
  try {
    fs.mkdirSync(projectsDir);
    console.log('uploads/projects directory created successfully');
  } catch (error) {
    console.error('Failed to create uploads/projects directory:', error.message);
    process.exit(1);
  }
} else {
  console.log('uploads/projects directory exists');
}

// Check permissions
try {
  // Try to write a test file
  const testFile = path.join(projectsDir, 'test.txt');
  fs.writeFileSync(testFile, 'test');
  console.log('Write permissions OK');
  
  // Clean up
  fs.unlinkSync(testFile);
} catch (error) {
  console.error('Permission issue detected:', error.message);
  console.log('Please run: chmod -R 755 uploads');
}

console.log('Directory check complete');