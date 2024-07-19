const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/userModel');
const College = require('./models/collegeModel');
const axios = require('axios'); // Add this line

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

const authRoutes = require('./routes/auth.routes');
const universityRoutes = require('./routes/universityRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/universities', universityRoutes);

// Example of a protected route
const authMiddleware = require('./middleware/auth.middleware');
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

// Add this route for fetching colleges
app.get('/api/colleges', async (req, res) => {
  try {
    const { page = 0, per_page = 20 } = req.query;
    const apiKey = process.env.COLLEGE_SCORECARD_API_KEY;
    const response = await axios.get('https://api.data.gov/ed/collegescorecard/v1/schools', {
      params: {
        api_key: apiKey,
        'school.degrees_awarded.predominant': '3,4',
        'school.ownership': '1,2',
        fields: 'id,school.name,school.city,school.state,school.zip,latest.admissions.admission_rate.overall',
        page,
        per_page
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ message: 'Error fetching colleges', error: error.message });
  }
});

app.get('/api/user/colleges', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('colleges');
    res.json(user.colleges);
  } catch (error) {
    console.error('Error fetching user colleges:', error);
    res.status(500).json({ message: 'Error fetching user colleges', error: error.message });
  }
});

app.post('/api/user/colleges', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { name, location, collegeId, admissionRate } = req.body;

    // Check if the college already exists in the database
    let college = await College.findOne({ collegeId });
    console.log('college details', college);
    if (!college) {
      // If the college doesn't exist, create a new one
      college = new College({ name, location, collegeId, admissionRate });
      await college.save();
    }

    // Add the college to the user's list if it's not already there
    if (!user.colleges.includes(college._id)) {
      user.colleges.push(college._id);
      await user.save();
    }

    res.json({ message: 'College added to user list' });
  } catch (error) {
    console.error('Error adding college to user list:', error);
    res.status(500).json({ message: 'Error adding college to user list', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});