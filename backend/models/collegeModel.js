const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  collegeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {type: String, required: true},
  location: {type: String, required: true},
  admissionRate: {type: Number, required: true}
});

module.exports = mongoose.model('College', collegeSchema);