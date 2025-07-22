const Testimonial = require('../models/Testimonial');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/testimonials directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'testimonials');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('💬 Created uploads/testimonials directory');
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `testimonial-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  console.log('💬 Checking file type:', file.mimetype);
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    console.log('💬 Image file accepted');
    return cb(null, true);
  }
  
  console.log('💬 File rejected - invalid type');
  cb(new Error('Only image files (JPEG, JPG, PNG, WEBP) are allowed'));
};

// Initialize upload
exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5000000 } // 5MB limit
});

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res) => {
  try {
    console.log('💬 Getting all testimonials');
    const testimonials = await Testimonial.getAll();
    console.log(`💬 Found ${testimonials.length} testimonials`);
    
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('💬 Error getting testimonials:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured testimonials
// @route   GET /api/testimonials/featured
// @access  Public
exports.getFeaturedTestimonials = async (req, res) => {
  try {
    console.log('💬 Getting featured testimonials');
    const testimonials = await Testimonial.getFeatured();
    console.log(`💬 Found ${testimonials.length} featured testimonials`);
    
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('💬 Error getting featured testimonials:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get testimonial by ID
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonial = async (req, res) => {
  try {
    console.log(`💬 Getting testimonial by ID: ${req.params.id}`);
    const testimonial = await Testimonial.getById(req.params.id);
    
    if (!testimonial) {
      console.log(`💬 Testimonial not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    console.log('💬 Testimonial found:', testimonial);
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('💬 Error getting testimonial:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private
exports.createTestimonial = async (req, res) => {
  try {
    console.log('💬 Creating new testimonial');
    console.log('💬 Request body:', req.body);
    console.log('💬 Request file:', req.file);
    
    // Validate required fields
    const { client_name, position, company, quote, rating } = req.body;
    
    if (!client_name || !position || !company || !quote) {
      console.log('💬 Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: client_name, position, company, quote'
      });
    }
    
    // Process testimonial data
    const testimonialData = {
      client_name: client_name.trim(),
      position: position.trim(),
      company: company.trim(),
      quote: quote.trim(),
      rating: parseInt(rating) || 5,
      featured: req.body.featured === 'true' || req.body.featured === true,
      image: null
    };
    
    // Handle image upload
    if (req.file) {
      testimonialData.image = `/uploads/testimonials/${req.file.filename}`;
      console.log('💬 Image uploaded:', testimonialData.image);
    }
    
    console.log('💬 Creating testimonial with data:', testimonialData);
    const testimonial = await Testimonial.create(testimonialData);
    console.log('💬 Testimonial created successfully:', testimonial);
    
    res.status(201).json({
      success: true,
      data: testimonial,
      message: 'Testimonial created successfully'
    });
  } catch (error) {
    console.error('💬 Error creating testimonial:', error);
    
    // Delete uploaded file if testimonial creation failed
    if (req.file) {
      const filePath = path.join(uploadDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('💬 Deleted uploaded file due to error');
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
exports.updateTestimonial = async (req, res) => {
  try {
    console.log(`💬 Updating testimonial: ${req.params.id}`);
    console.log('💬 Request body:', req.body);
    console.log('💬 Request file:', req.file);
    
    // Check if testimonial exists
    let testimonial = await Testimonial.getById(req.params.id);
    
    if (!testimonial) {
      console.log(`💬 Testimonial not found for update: ${req.params.id}`);
      
      // Delete uploaded file if testimonial doesn't exist
      if (req.file) {
        const filePath = path.join(uploadDir, req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    // Process update data
    const testimonialData = {
      client_name: req.body.client_name ? req.body.client_name.trim() : testimonial.client_name,
      position: req.body.position ? req.body.position.trim() : testimonial.position,
      company: req.body.company ? req.body.company.trim() : testimonial.company,
      quote: req.body.quote ? req.body.quote.trim() : testimonial.quote,
      rating: req.body.rating ? parseInt(req.body.rating) : testimonial.rating,
      featured: req.body.featured !== undefined ? 
        (req.body.featured === 'true' || req.body.featured === true) : 
        testimonial.featured
    };
    
    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (testimonial.image) {
        const oldFilePath = path.join(__dirname, '..', testimonial.image);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log('💬 Deleted old testimonial image');
        }
      }
      
      testimonialData.image = `/uploads/testimonials/${req.file.filename}`;
      console.log('💬 New image uploaded:', testimonialData.image);
    } else {
      testimonialData.image = testimonial.image;
      console.log('💬 Keeping existing image:', testimonialData.image);
    }
    
    console.log('💬 Updating testimonial with data:', testimonialData);
    testimonial = await Testimonial.update(req.params.id, testimonialData);
    console.log('💬 Testimonial updated successfully:', testimonial);
    
    res.status(200).json({
      success: true,
      data: testimonial,
      message: 'Testimonial updated successfully'
    });
  } catch (error) {
    console.error('💬 Error updating testimonial:', error);
    
    // Delete uploaded file if update failed
    if (req.file) {
      const filePath = path.join(uploadDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('💬 Deleted uploaded file due to error');
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
exports.deleteTestimonial = async (req, res) => {
  try {
    console.log(`💬 Deleting testimonial: ${req.params.id}`);
    
    // Check if testimonial exists
    const testimonial = await Testimonial.getById(req.params.id);
    
    if (!testimonial) {
      console.log(`💬 Testimonial not found for deletion: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    // Delete testimonial image if exists
    if (testimonial.image) {
      const filePath = path.join(__dirname, '..', testimonial.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('💬 Deleted testimonial image');
      }
    }
    
    // Delete testimonial from database
    await Testimonial.delete(req.params.id);
    console.log('💬 Testimonial deleted successfully from database');
    
    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('💬 Error deleting testimonial:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};