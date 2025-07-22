const express = require('express');
const {
  getProjects,
  getFeaturedProjects,
  getProject,
  getProjectsByCategory,
  getCategories,
  createProject,
  updateProject,
  deleteProject,
  upload
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/categories', getCategories);
router.get('/category/:category', getProjectsByCategory);
router.get('/:id', getProject);

// Protected routes
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 }
  ]),
  createProject
);

router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 }
  ]),
  updateProject
);

router.delete('/:id', protect, deleteProject);

module.exports = router;