const { pool } = require('../config/db');

const Project = {
  // Get all projects
  getAll: async () => {
    try {
      console.log('🏗️ Model: Getting all projects');
      const [rows] = await pool.execute(`
        SELECT 
          id, title, category, description, client, location, year, 
          featured, image_main, gallery, created_at, updated_at
        FROM projects 
        ORDER BY created_at DESC
      `);
      
      // Parse gallery JSON if it exists
      const projects = rows.map(project => ({
        ...project,
        gallery: project.gallery ? JSON.parse(project.gallery) : []
      }));
      
      console.log(`🏗️ Model: Found ${projects.length} projects`);
      return projects;
    } catch (error) {
      console.error('🏗️ Model: Error getting all projects:', error);
      throw error;
    }
  },

  // Get featured projects
  getFeatured: async () => {
    try {
      console.log('🏗️ Model: Getting featured projects');
      const [rows] = await pool.execute(`
        SELECT 
          id, title, category, description, client, location, year, 
          featured, image_main, gallery, created_at, updated_at
        FROM projects 
        WHERE featured = 1 
        ORDER BY created_at DESC
      `);
      
      // Parse gallery JSON if it exists
      const projects = rows.map(project => ({
        ...project,
        gallery: project.gallery ? JSON.parse(project.gallery) : []
      }));
      
      console.log(`🏗️ Model: Found ${projects.length} featured projects`);
      return projects;
    } catch (error) {
      console.error('🏗️ Model: Error getting featured projects:', error);
      throw error;
    }
  },

  // Get project by ID
  getById: async (id) => {
    try {
      console.log(`🏗️ Model: Getting project by ID: ${id}`);
      const [rows] = await pool.execute(`
        SELECT 
          id, title, category, description, client, location, year, 
          featured, image_main, gallery, created_at, updated_at
        FROM projects 
        WHERE id = ?
      `, [id]);
      
      if (rows.length === 0) {
        console.log(`🏗️ Model: Project not found: ${id}`);
        return null;
      }
      
      const project = {
        ...rows[0],
        gallery: rows[0].gallery ? JSON.parse(rows[0].gallery) : []
      };
      
      console.log(`🏗️ Model: Project found:`, project);
      return project;
    } catch (error) {
      console.error('🏗️ Model: Error getting project by ID:', error);
      throw error;
    }
  },

  // Get projects by category
  getByCategory: async (category) => {
    try {
      console.log(`🏗️ Model: Getting projects by category: ${category}`);
      const [rows] = await pool.execute(`
        SELECT 
          id, title, category, description, client, location, year, 
          featured, image_main, gallery, created_at, updated_at
        FROM projects 
        WHERE category = ? 
        ORDER BY created_at DESC
      `, [category]);
      
      // Parse gallery JSON if it exists
      const projects = rows.map(project => ({
        ...project,
        gallery: project.gallery ? JSON.parse(project.gallery) : []
      }));
      
      console.log(`🏗️ Model: Found ${projects.length} projects in category ${category}`);
      return projects;
    } catch (error) {
      console.error('🏗️ Model: Error getting projects by category:', error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      console.log('🏗️ Model: Getting all project categories');
      const [rows] = await pool.execute(`
        SELECT DISTINCT category 
        FROM projects 
        WHERE category IS NOT NULL AND category != '' 
        ORDER BY category ASC
      `);
      
      const categories = rows.map(row => row.category);
      console.log(`🏗️ Model: Found categories:`, categories);
      return categories;
    } catch (error) {
      console.error('🏗️ Model: Error getting categories:', error);
      throw error;
    }
  },

  // Create new project
  create: async (projectData) => {
    try {
      console.log('🏗️ Model: Creating new project:', projectData);
      
      // Prepare gallery data
      let galleryJson = null;
      if (projectData.gallery) {
        galleryJson = Array.isArray(projectData.gallery) 
          ? JSON.stringify(projectData.gallery)
          : projectData.gallery;
      }
      
      const [result] = await pool.execute(`
        INSERT INTO projects (
          title, category, description, client, location, year, 
          featured, image_main, gallery, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [
        projectData.title,
        projectData.category,
        projectData.description,
        projectData.client || null,
        projectData.location || null,
        projectData.year || null,
        projectData.featured ? 1 : 0,
        projectData.image_main || null,
        galleryJson
      ]);
      
      console.log(`🏗️ Model: Project created with ID: ${result.insertId}`);
      
      // Return the created project
      return await Project.getById(result.insertId);
    } catch (error) {
      console.error('🏗️ Model: Error creating project:', error);
      throw error;
    }
  },

  // Update project
  update: async (id, projectData) => {
    try {
      console.log(`🏗️ Model: Updating project ${id}:`, projectData);
      
      // Prepare gallery data
      let galleryJson = null;
      if (projectData.gallery) {
        galleryJson = Array.isArray(projectData.gallery) 
          ? JSON.stringify(projectData.gallery)
          : projectData.gallery;
      }
      
      await pool.execute(`
        UPDATE projects SET 
          title = ?, category = ?, description = ?, client = ?, 
          location = ?, year = ?, featured = ?, image_main = ?, 
          gallery = ?, updated_at = NOW()
        WHERE id = ?
      `, [
        projectData.title,
        projectData.category,
        projectData.description,
        projectData.client || null,
        projectData.location || null,
        projectData.year || null,
        projectData.featured ? 1 : 0,
        projectData.image_main || null,
        galleryJson,
        id
      ]);
      
      console.log(`🏗️ Model: Project ${id} updated successfully`);
      
      // Return the updated project
      return await Project.getById(id);
    } catch (error) {
      console.error('🏗️ Model: Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  delete: async (id) => {
    try {
      console.log(`🏗️ Model: Deleting project: ${id}`);
      
      const [result] = await pool.execute('DELETE FROM projects WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Project not found');
      }
      
      console.log(`🏗️ Model: Project ${id} deleted successfully`);
      return true;
    } catch (error) {
      console.error('🏗️ Model: Error deleting project:', error);
      throw error;
    }
  }
};

module.exports = Project;