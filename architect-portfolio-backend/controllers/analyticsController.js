const { pool } = require('../config/db');

// Get analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT page_url, visits, last_visited FROM analytics ORDER BY visits DESC');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};