const { pool } = require('../config/db');

class Testimonial {
  // Get all testimonials
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM testimonials ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw new Error('Error fetching testimonials: ' + error.message);
    }
  }
  
  // Get featured testimonials
  static async getFeatured() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM testimonials WHERE featured = true ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw new Error('Error fetching featured testimonials: ' + error.message);
    }
  }
  
  // Get testimonial by id
  static async getById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM testimonials WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error('Error fetching testimonial: ' + error.message);
    }
  }
  
  // Create a new testimonial
  static async create(testimonialData) {
    const {
      client_name,
      position,
      company,
      quote,
      rating,
      image,
      featured
    } = testimonialData;
    
    try {
      const [result] = await pool.execute(
        `INSERT INTO testimonials (client_name, position, company, quote, rating, image, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [client_name, position, company, quote, rating || 5, image, featured || false]
      );
      
      return {
        id: result.insertId,
        ...testimonialData
      };
    } catch (error) {
      throw new Error('Error creating testimonial: ' + error.message);
    }
  }
  
  // Update testimonial
  static async update(id, testimonialData) {
    const {
      client_name,
      position,
      company,
      quote,
      rating,
      image,
      featured
    } = testimonialData;
    
    try {
      await pool.execute(
        `UPDATE testimonials SET
         client_name = ?,
         position = ?,
         company = ?,
         quote = ?,
         rating = ?,
         image = ?,
         featured = ?
         WHERE id = ?`,
        [client_name, position, company, quote, rating || 5, image, featured || false, id]
      );
      
      return {
        id: parseInt(id),
        ...testimonialData
      };
    } catch (error) {
      throw new Error('Error updating testimonial: ' + error.message);
    }
  }
  
  // Delete testimonial
  static async delete(id) {
    try {
      await pool.execute('DELETE FROM testimonials WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw new Error('Error deleting testimonial: ' + error.message);
    }
  }
}

module.exports = Testimonial;