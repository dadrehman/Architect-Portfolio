const express = require('express');
const {
  getSettings,
  getSetting,
  updateSetting,
  updateSettings
} = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getSettings);
router.get('/:key', getSetting);

// Protected routes
router.put('/:key', protect, updateSetting);
router.put('/', protect, updateSettings);

module.exports = router;