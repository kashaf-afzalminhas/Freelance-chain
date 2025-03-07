const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    walletAddress: { type: String, unique: true, required: true }, // Wallet address as unique identifier
    nonce: { type: String }, // Random nonce for signing
    role: { type: String, enum: ['client', 'freelancer'], default: null }, // Role selection
    name: { type: String }, // User's name
});

module.exports = mongoose.model('User', UserSchema);