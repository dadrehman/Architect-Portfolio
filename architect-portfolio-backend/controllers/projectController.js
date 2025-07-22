const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const ensureUploadsDir = () => {
  const projectsDir = path.join(__dirname, '..', 'uploads', 'projects');
  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true });
    console.log('Created uploads/projects directory');
  }
};

// Call this function to ensure directory exists
ensureUploadsDir();

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectsDir = path.join(__dirname, '..', 'uploads', 'projects');
    cb(null, projectsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `project-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  
  cb(new Error('Only image files are allowed'));
};

// Initialize upload
exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10000000 } // 10MB limit
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.getAll();
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error in getProjects:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
exports.getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.getFeatured();
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error in getFeaturedProjects:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res) => {
  try {
    const project = await Project.getById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error in getProject:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get projects by category
// @route   GET /api/projects/category/:category
// @access  Public
exports.getProjectsByCategory = async (req, res) => {
  try {
    const projects = await Project.getByCategory(req.params.category);
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error in getProjectsByCategory:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    // Process images
    const projectData = { ...req.body };
    
    // Main image
    if (req.files && req.files.mainImage) {
      projectData.image_main = `/uploads/projects/${req.files.mainImage[0].filename}`;
      console.log('Main image path:', projectData.image_main);
    }
    
    // Gallery images
    if (req.files && req.files.galleryImages) {
      projectData.gallery = req.files.galleryImages.map(file => `/uploads/projects/${file.filename}`);
      console.log('Gallery image paths:', projectData.gallery);
    }
    
    // Convert featured to boolean
    projectData.featured = projectData.featured === 'true' || projectData.featured === true;
    
    // Create project
    console.log('Creating project with data:', projectData);
    const project = await Project.create(projectData);
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    // Check if project exists
    let project = await Project.getById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Process images
    const projectData = { ...req.body };
    
    // Main image
    if (req.files && req.files.mainImage) {
      // Delete old main image if exists
      if (project.image_main && fs.existsSync(`.${project.image_main}`)) {
        fs.unlinkSync(`.${project.image_main}`);
      }
      
      projectData.image_main = `/uploads/projects/${req.files.mainImage[0].filename}`;
    } else {
      projectData.image_main = project.image_main;
    }
    
    // Gallery images
    if (req.files && req.files.galleryImages) {
      // Delete old gallery images if exists
      if (project.gallery) {
        const gallery = typeof project.gallery === 'string' 
          ? JSON.parse(project.gallery) 
          : project.gallery;
          
        if (Array.isArray(gallery)) {
          gallery.forEach(image => {
            if (fs.existsSync(`.${image}`)) {
              fs.unlinkSync(`.${image}`);
            }
          });
        }
      }
      
      projectData.gallery = req.files.galleryImages.map(file => `/uploads/projects/${file.filename}`);
    } else {
      projectData.gallery = project.gallery;
    }
    
    // Convert featured to boolean
    projectData.featured = projectData.featured === 'true' || projectData.featured === true;
    
    // Update project
    project = await Project.update(req.params.id, projectData);
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    // Check if project exists
    const project = await Project.getById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Delete project images
    if (project.image_main && fs.existsSync(`.${project.image_main}`)) {
      fs.unlinkSync(`.${project.image_main}`);
    }
    
    if (project.gallery) {
      const gallery = typeof project.gallery === 'string' 
        ? JSON.parse(project.gallery) 
        : project.gallery;
        
      if (Array.isArray(gallery)) {
        gallery.forEach(image => {
          if (fs.existsSync(`.${image}`)) {
            fs.unlinkSync(`.${image}`);
          }
        });
      }
    }
    
    // Delete project
    await Project.delete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get project categories
// @route   GET /api/projects/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Project.getCategories();
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};