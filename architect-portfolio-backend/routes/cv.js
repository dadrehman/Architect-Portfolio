const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');
const cvController = require('../controllers/cvController');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📄 Created uploads directory for CV');
}

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `cv-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  console.log('📄 File filter - checking file:', file);
  
  // Check if file is PDF
  if (file.mimetype === 'application/pdf') {
    console.log('📄 PDF file accepted');
    cb(null, true);
  } else {
    console.log('📄 File rejected - not PDF:', file.mimetype);
    const error = new Error('Only PDF files are allowed');
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

const upload = multer({
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only 1 file allowed
  },
  fileFilter,
});

// Middleware to handle multer errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.log('📄 Multer error:', err.code, err.message);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File too large. Maximum size is 10MB.' 
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        success: false, 
        message: 'Unexpected file field. Only "cvFile" field is allowed.' 
      });
    }
    
    return res.status(400).json({ 
      success: false, 
      message: `Upload error: ${err.message}` 
    });
  }
  
  if (err && err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
  
  if (err) {
    console.log('📄 Other upload error:', err);
    return res.status(400).json({ 
      success: false, 
      message: err.message || 'File upload failed' 
    });
  }
  
  next();
};

// Routes
router.get('/', (req, res, next) => {
  console.log('📄 GET /api/cv - Getting all CVs');
  next();
}, cvController.getAllCVs);

router.get('/:id', (req, res, next) => {
  console.log(`📄 GET /api/cv/${req.params.id} - Getting CV by ID`);
  next();
}, cvController.getCVById);

router.post('/', protect, (req, res, next) => {
  console.log('📄 POST /api/cv - Creating new CV');
  next();
}, upload.single('cvFile'), handleUploadError, (req, res, next) => {
  console.log('📄 Upload successful, proceeding to controller');
  next();
}, cvController.createCV);

router.put('/:id', protect, (req, res, next) => {
  console.log(`📄 PUT /api/cv/${req.params.id} - Updating CV`);
  next();
}, upload.single('cvFile'), handleUploadError, cvController.updateCV);

router.delete('/:id', protect, (req, res, next) => {
  console.log(`📄 DELETE /api/cv/${req.params.id} - Deleting CV`);
  next();
}, cvController.deleteCV);

module.exports = router;