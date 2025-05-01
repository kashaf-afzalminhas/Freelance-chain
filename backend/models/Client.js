const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String }, // Company name (optional)
});

module.exports = mongoose.model('Client', ClientSchema);