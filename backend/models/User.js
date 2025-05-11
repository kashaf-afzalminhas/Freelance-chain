const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    walletAddress: { type: String, unique: true, required: true },
    nonce: { type: String }, // For MetaMask login
    role: { type: String, enum: ['client', 'freelancer'], default: null },
    name: { type: String },
    bio: { type: String }, // General bio field for all users
    portfolioLinks: {
        linkedin: { type: String },
        github: { type: String },
        personalPortfolio: { type: String }
    },
    profileImage: { type: String }, // URL or IPFS hash for profile image
    ratings: { type: Number, default: 0 }, // General ratings field
});

module.exports = mongoose.model('User', UserSchema);