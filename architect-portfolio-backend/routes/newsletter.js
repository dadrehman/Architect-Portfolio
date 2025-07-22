const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const newsletterController = require('../controllers/newsletterController');

// Routes
router.post('/subscribe', newsletterController.subscribe); // Public route to subscribe
router.get('/subscribers', protect, newsletterController.getSubscribers); // Protected route for admin to get subscribers

module.exports = router;