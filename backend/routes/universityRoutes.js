const express = require('express');
const router = express.Router();
const universityService = require('../services/universityService');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const perPage = parseInt(req.query.perPage) || 20;
    const universities = await universityService.getUniversities(page, perPage);
    res.json(universities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching universities', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const university = await universityService.getUniversityById(req.params.id);
    res.json(university);
  } catch (error) {
    console.error('Error in route handler:', error); // Add logging
    res.status(500).json({ message: 'Error fetching university details', error: error.message });
  }
});

module.exports = router;