const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { apiLimiter } = require('./middleware/rateLimit');

// Load environment variables
dotenv.config();

// Create uploads directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    './uploads',
    './uploads/projects', 
    './uploads/testimonials',
    './uploads/cv'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
};

// Create upload directories
createUploadDirs();

// Import routes
const adminRoutes = require('./routes/admin');
const projectRoutes = require('./routes/projects');
const testimonialRoutes = require('./routes/testimonials');
const settingRoutes = require('./routes/settings');
const cvRoutes = require('./routes/cv');
const blogRoutes = require('./routes/blogs');
const newsletterRoutes = require('./routes/newsletter');
const analyticsRoutes = require('./routes/analytics');

// Create Express app
const app = express();

// Body parser middleware - INCREASED LIMITS FOR FILE UPLOADS
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS middleware - Enhanced configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'https://architectshahab.site',
    'https://admin.architectshahab.site',
    'https://api.architectshahab.site'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Request body:', req.body);
  }
  next();
});

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API server is working correctly',
    timestamp: new Date().toISOString()
  });
});

// Rate limiting middleware - APPLIED AFTER HEALTH CHECKS
app.use('/api', apiLimiter);

// Set static folder for uploads with proper headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    // Set CORS headers for uploaded files
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// API routes with logging
app.use('/api/admin', (req, res, next) => {
  console.log('🔐 Admin route accessed:', req.path);
  next();
}, adminRoutes);

app.use('/api/projects', (req, res, next) => {
  console.log('🏗️ Projects route accessed:', req.path);
  next();
}, projectRoutes);

app.use('/api/testimonials', (req, res, next) => {
  console.log('💬 Testimonials route accessed:', req.path);
  next();
}, testimonialRoutes);

app.use('/api/settings', (req, res, next) => {
  console.log('⚙️ Settings route accessed:', req.path);
  next();
}, settingRoutes);

app.use('/api/cv', (req, res, next) => {
  console.log('📄 CV route accessed:', req.path);
  next();
}, cvRoutes);

app.use('/api/blogs', (req, res, next) => {
  console.log('📝 Blogs route accessed:', req.path);
  next();
}, blogRoutes);

app.use('/api/newsletter', (req, res, next) => {
  console.log('📧 Newsletter route accessed:', req.path);
  next();
}, newsletterRoutes);

app.use('/api/analytics', (req, res, next) => {
  console.log('📊 Analytics route accessed:', req.path);
  next();
}, analyticsRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Architect Portfolio API Server',
    version: '1.0.0',
    endpoints: {
      admin: '/api/admin',
      projects: '/api/projects', 
      testimonials: '/api/testimonials',
      settings: '/api/settings',
      cv: '/api/cv',
      blogs: '/api/blogs',
      newsletter: '/api/newsletter',
      analytics: '/api/analytics'
    }
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  console.log(`❌ 404 - API route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: `API route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/projects',
      'GET /api/projects/categories', 
      'POST /api/projects',
      'GET /api/testimonials',
      'POST /api/testimonials',
      'GET /api/blogs',
      'POST /api/blogs',
      'GET /api/cv',
      'POST /api/cv',
      'GET /api/settings',
      'POST /api/admin/login'
    ]
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Global error:', err.stack);
  
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 10MB.'
    });
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files uploaded.'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field.'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Upload directories created successfully`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;