const Newsletter = require('../models/Newsletter');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const subscriber = await Newsletter.subscribe(email);
    res.status(201).json({ success: true, data: subscriber });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all subscribers (for admin)
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.getAll();
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};