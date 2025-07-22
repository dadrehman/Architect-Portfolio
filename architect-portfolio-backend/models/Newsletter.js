const { pool } = require('../config/db');

class Newsletter {
  // Subscribe to newsletter
  static async subscribe(email) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO newsletter_subscribers (email) VALUES (?)',
        [email]
      );
      return { id: result.insertId, email };
    } catch (error) {
      throw new Error('Error subscribing to newsletter: ' + error.message);
    }
  }

  // Get all subscribers
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC');
      return rows;
    } catch (error) {
      throw new Error('Error fetching subscribers: ' + error.message);
    }
  }
}

module.exports = Newsletter;