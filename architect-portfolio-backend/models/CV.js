const { pool } = require('../config/db');

class CV {
  // Get all CVs
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM cv ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw new Error('Error fetching CVs: ' + error.message);
    }
  }

  // Get CV by ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM cv WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Error fetching CV: ' + error.message);
    }
  }

  // Create a new CV
  static async create(cvData) {
    try {
      const { title, file_path } = cvData;
      const [result] = await pool.execute(
        'INSERT INTO cv (title, file_path) VALUES (?, ?)',
        [title, file_path]
      );
      return { id: result.insertId, title, file_path };
    } catch (error) {
      throw new Error('Error creating CV: ' + error.message);
    }
  }

  // Update CV
  static async update(id, cvData) {
    try {
      const { title, file_path } = cvData;
      await pool.execute(
        'UPDATE cv SET title = ?, file_path = ? WHERE id = ?',
        [title, file_path, id]
      );
      return { id: parseInt(id), title, file_path };
    } catch (error) {
      throw new Error('Error updating CV: ' + error.message);
    }
  }

  // Delete CV
  static async delete(id) {
    try {
      await pool.execute('DELETE FROM cv WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw new Error('Error deleting CV: ' + error.message);
    }
  }
}

module.exports = CV;