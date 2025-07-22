const { pool } = require('../config/db');

class Blog {
  // Get all blogs
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM blogs ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw new Error('Error fetching blogs: ' + error.message);
    }
  }

  // Get blog by ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM blogs WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Error fetching blog: ' + error.message);
    }
  }

  // Create a new blog
  static async create(blogData) {
    try {
      const { title, description, content, seo_title, seo_description } = blogData;
      const [result] = await pool.execute(
        'INSERT INTO blogs (title, description, content, seo_title, seo_description) VALUES (?, ?, ?, ?, ?)',
        [title, description, content, seo_title || title, seo_description || description]
      );
      return { id: result.insertId, title, description, content, seo_title, seo_description, likes: 0 };
    } catch (error) {
      throw new Error('Error creating blog: ' + error.message);
    }
  }

  // Update blog
  static async update(id, blogData) {
    try {
      const { title, description, content, seo_title, seo_description } = blogData;
      await pool.execute(
        'UPDATE blogs SET title = ?, description = ?, content = ?, seo_title = ?, seo_description = ? WHERE id = ?',
        [title, description, content, seo_title || title, seo_description || description, id]
      );
      return { id: parseInt(id), title, description, content, seo_title, seo_description };
    } catch (error) {
      throw new Error('Error updating blog: ' + error.message);
    }
  }

  // Delete blog
  static async delete(id) {
    try {
      await pool.execute('DELETE FROM blogs WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw new Error('Error deleting blog: ' + error.message);
    }
  }

  // Like a blog
  static async like(id) {
    try {
      await pool.execute('UPDATE blogs SET likes = likes + 1 WHERE id = ?', [id]);
      const blog = await this.getById(id);
      return blog;
    } catch (error) {
      throw new Error('Error liking blog: ' + error.message);
    }
  }
}

module.exports = Blog;