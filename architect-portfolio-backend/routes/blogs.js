const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const blogController = require('../controllers/blogController');

// Routes
router.get('/', blogController.getAllBlogs); // Public route to get all blogs
router.get('/:id', blogController.getBlogById); // Public route to get blog by ID
router.post('/', protect, blogController.createBlog); // Protected route to create blog
router.put('/:id', protect, blogController.updateBlog); // Protected route to update blog
router.delete('/:id', protect, blogController.deleteBlog); // Protected route to delete blog
router.post('/:id/like', blogController.likeBlog); // Public route to like a blog

module.exports = router;