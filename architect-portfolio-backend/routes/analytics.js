const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

// Routes
router.get('/', protect, analyticsController.getAnalytics); // Protected route for admin to get analytics

module.exports = router;