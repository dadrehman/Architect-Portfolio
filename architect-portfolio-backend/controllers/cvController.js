const CV = require('../models/CV');
const path = require('path');
const fs = require('fs');

// Get all CVs
exports.getAllCVs = async (req, res) => {
  try {
    console.log('📄 Getting all CVs');
    const cvs = await CV.getAll();
    console.log(`📄 Found ${cvs.length} CVs`);
    res.status(200).json({ 
      success: true, 
      count: cvs.length,
      data: cvs 
    });
  } catch (error) {
    console.error('📄 Error getting CVs:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get CV by ID
exports.getCVById = async (req, res) => {
  try {
    console.log(`📄 Getting CV by ID: ${req.params.id}`);
    const cv = await CV.getById(req.params.id);
    if (!cv) {
      console.log(`📄 CV not found: ${req.params.id}`);
      return res.status(404).json({ 
        success: false, 
        message: 'CV not found' 
      });
    }
    console.log(`📄 CV found:`, cv);
    res.status(200).json({ 
      success: true, 
      data: cv 
    });
  } catch (error) {
    console.error('📄 Error getting CV by ID:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Create CV
exports.createCV = async (req, res) => {
  try {
    console.log('📄 Creating new CV');
    console.log('📄 Request body:', req.body);
    console.log('📄 Request file:', req.file);
    
    if (!req.file) {
      console.log('📄 No file uploaded');
      return res.status(400).json({ 
        success: false, 
        message: 'CV file is required' 
      });
    }
    
    if (!req.body.title || req.body.title.trim() === '') {
      console.log('📄 No title provided');
      return res.status(400).json({ 
        success: false, 
        message: 'CV title is required' 
      });
    }
    
    const cvData = {
      title: req.body.title.trim(),
      file_path: `/uploads/${req.file.filename}`,
    };
    
    console.log('📄 Creating CV with data:', cvData);
    const cv = await CV.create(cvData);
    console.log('📄 CV created successfully:', cv);
    
    res.status(201).json({ 
      success: true, 
      data: cv,
      message: 'CV created successfully'
    });
  } catch (error) {
    console.error('📄 Error creating CV:', error);
    
    // Delete uploaded file if CV creation failed
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('📄 Deleted uploaded file due to error');
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update CV
exports.updateCV = async (req, res) => {
  try {
    console.log(`📄 Updating CV: ${req.params.id}`);
    console.log('📄 Request body:', req.body);
    console.log('📄 Request file:', req.file);
    
    const cv = await CV.getById(req.params.id);
    if (!cv) {
      console.log(`📄 CV not found for update: ${req.params.id}`);
      
      // Delete uploaded file if CV doesn't exist
      if (req.file) {
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      return res.status(404).json({ 
        success: false, 
        message: 'CV not found' 
      });
    }

    // Prepare update data
    const cvData = {
      title: req.body.title ? req.body.title.trim() : cv.title,
    };
    
    // Handle file update
    if (req.file) {
      // Delete old file if it exists
      if (cv.file_path) {
        const oldFilePath = path.join(__dirname, '..', cv.file_path);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log('📄 Deleted old CV file');
        }
      }
      
      cvData.file_path = `/uploads/${req.file.filename}`;
      console.log('📄 New file uploaded:', cvData.file_path);
    } else {
      cvData.file_path = cv.file_path;
      console.log('📄 Keeping existing file:', cvData.file_path);
    }

    console.log('📄 Updating CV with data:', cvData);
    const updatedCV = await CV.update(req.params.id, cvData);
    console.log('📄 CV updated successfully:', updatedCV);
    
    res.status(200).json({ 
      success: true, 
      data: updatedCV,
      message: 'CV updated successfully'
    });
  } catch (error) {
    console.error('📄 Error updating CV:', error);
    
    // Delete uploaded file if update failed
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('📄 Deleted uploaded file due to error');
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete CV
exports.deleteCV = async (req, res) => {
  try {
    console.log(`📄 Deleting CV: ${req.params.id}`);
    
    const cv = await CV.getById(req.params.id);
    if (!cv) {
      console.log(`📄 CV not found for deletion: ${req.params.id}`);
      return res.status(404).json({ 
        success: false, 
        message: 'CV not found' 
      });
    }

    // Delete the file from the server
    if (cv.file_path) {
      const filePath = path.join(__dirname, '..', cv.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('📄 Deleted CV file from disk');
      }
    }

    await CV.delete(req.params.id);
    console.log('📄 CV deleted successfully from database');
    
    res.status(200).json({ 
      success: true, 
      message: 'CV deleted successfully' 
    });
  } catch (error) {
    console.error('📄 Error deleting CV:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};