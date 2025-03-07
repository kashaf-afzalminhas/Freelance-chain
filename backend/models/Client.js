const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    company: { type: String },
});

module.exports = mongoose.model('Client', ClientSchema);
