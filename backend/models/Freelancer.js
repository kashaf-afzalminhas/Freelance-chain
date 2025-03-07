const mongoose = require('mongoose');

const FreelancerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skills: { type: [String], required: true }, // Array of skills
    experience: { type: String }, // Experience (optional)
});

module.exports = mongoose.model('Freelancer', FreelancerSchema);