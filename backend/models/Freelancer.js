const mongoose = require('mongoose');

const FreelancerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    skills: { type: [String], required: true },
    experience: { type: String },
});

module.exports = mongoose.model('Freelancer', FreelancerSchema);
