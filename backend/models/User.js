const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    walletAddress: { type: String, unique: true, required: true },
    nonce: { type: String }, // For MetaMask login
    role: { type: String, enum: ['client', 'freelancer'], default: null },
    name: { type: String },
  });

module.exports = mongoose.model('User', UserSchema);