const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateProfileUpdate = [
  body('name').optional().isString().trim(),
  body('portfolioLinks').optional().isArray(),
  body('portfolioLinks.*').optional().isURL(),
  body('bio').optional().isString().trim()
];

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

exports.updateUserProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user profile" });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id;
    const filePath = `/uploads/profile-images/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(userId, { profileImage: filePath }, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile image uploaded successfully", profileImage: filePath });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to upload profile image" });
  }
};

exports.getUserPublicProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("name skills portfolioLinks profileImage ratings bio");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch public profile" });
  }
};

// Export validation middleware
exports.validateProfileUpdate = validateProfileUpdate;

// console.log({
//   getUserProfile: exports.getUserProfile,
//   updateUserProfile: exports.updateUserProfile,
//   uploadProfileImage: exports.uploadProfileImage,
//   getUserPublicProfile: exports.getUserPublicProfile,
// });