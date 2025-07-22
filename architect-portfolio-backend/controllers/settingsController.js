const Setting = require('../models/Setting');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.getAll();
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get setting by key
// @route   GET /api/settings/:key
// @access  Public
exports.getSetting = async (req, res) => {
  try {
    const value = await Setting.getByKey(req.params.key);
    
    if (value === null) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { key: req.params.key, value }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update setting
// @route   PUT /api/settings/:key
// @access  Private
exports.updateSetting = async (req, res) => {
  try {
    const { value } = req.body;
    
    if (!value && value !== '' && value !== false && value !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide value'
      });
    }
    
    const setting = await Setting.update(req.params.key, value);
    
    res.status(200).json({
      success: true,
      data: setting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update multiple settings
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    const settings = req.body;
    
    if (!settings || Object.keys(settings).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide settings'
      });
    }
    
    const updatedSettings = await Setting.updateMultiple(settings);
    
    res.status(200).json({
      success: true,
      data: updatedSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};