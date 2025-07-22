const Admin = require('../models/Admin');

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Login admin
    const admin = await Admin.login(email, password);
    
    if (!admin) {
      console.log('Login failed: Invalid credentials for', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // If successfully authenticated
    console.log('Login successful for:', email);
    console.log('Generated token:', admin.token ? admin.token.substring(0, 20) + '...' : 'no token');
    
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current admin
// @route   GET /api/admin/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.getById(req.admin.id);
    
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Error getting admin profile:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update admin details
// @route   PUT /api/admin/me
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Validate input
    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and email'
      });
    }
    
    // Update admin
    const admin = await Admin.update(req.admin.id, { username, email });
    
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Error updating admin details:', error.message);
    if (error.message === 'Email already exists') {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update admin password
// @route   PUT /api/admin/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Validate input
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide password'
      });
    }
    
    // Update admin
    await Admin.update(req.admin.id, { 
      username: req.admin.username,
      email: req.admin.email,
      password
    });
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};