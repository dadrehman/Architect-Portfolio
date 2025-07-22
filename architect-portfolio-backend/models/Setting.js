const { pool } = require('../config/db');

class Setting {
  // Get all settings
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM settings'
      );
      
      // Convert rows array to object with key-value pairs
      const settings = {};
      rows.forEach(row => {
        settings[row.key] = row.value;
      });
      
      return settings;
    } catch (error) {
      throw new Error('Error fetching settings: ' + error.message);
    }
  }
  
  // Get setting by key
  static async getByKey(key) {
    try {
      const [rows] = await pool.execute(
        'SELECT `value` FROM settings WHERE `key` = ?',
        [key]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0].value;
    } catch (error) {
      throw new Error('Error fetching setting: ' + error.message);
    }
  }
  
  // Update setting
  static async update(key, value) {
    try {
      // Check if setting exists
      const [existRows] = await pool.execute(
        'SELECT 1 FROM settings WHERE `key` = ?',
        [key]
      );
      
      if (existRows.length === 0) {
        // Insert new setting if it doesn't exist
        await pool.execute(
          'INSERT INTO settings (`key`, `value`) VALUES (?, ?)',
          [key, value]
        );
      } else {
        // Update existing setting
        await pool.execute(
          'UPDATE settings SET `value` = ? WHERE `key` = ?',
          [value, key]
        );
      }
      
      return { key, value };
    } catch (error) {
      throw new Error('Error updating setting: ' + error.message);
    }
  }
  
  // Update multiple settings
  static async updateMultiple(settings) {
    try {
      const promises = [];
      
      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        promises.push(this.update(key, value));
      }
      
      await Promise.all(promises);
      
      return settings;
    } catch (error) {
      throw new Error('Error updating settings: ' + error.message);
    }
  }
}

module.exports = Setting;