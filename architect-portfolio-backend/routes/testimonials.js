const express = require('express');
const {
  getTestimonials,
  getFeaturedTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  upload
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getTestimonials);
router.get('/featured', getFeaturedTestimonials);
router.get('/:id', getTestimonial);

// Protected routes
router.post('/', protect, upload.single('image'), createTestimonial);
router.put('/:id', protect, upload.single('image'), updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;