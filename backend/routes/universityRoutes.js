const express = require('express');
const router = express.Router();
const universityService = require('../services/universityService');
const authMiddleware = require('../middleware/auth.middleware');
const User = require('../models/userModel');

// Get user's colleges
router.get('/user/colleges', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('colleges');
    res.json(user.colleges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user colleges', error: error.message });
  }
});

// Add college to user's list
router.post('/user/colleges', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.colleges.push(req.body.collegeId);
    await user.save();
    res.json({ message: 'College added to user list' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding college to user list', error: error.message });
  }
});

module.exports = router;