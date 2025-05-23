const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  getUserPublicProfile,
  validateProfileUpdate,
  removeProfileImage
} = require('../controllers/profileController');

const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get user's own profile
router.get('/', auth, getUserProfile);

// Update user profile
router.put('/', auth, validateProfileUpdate, updateUserProfile);

// Upload profile image
router.post('/upload', auth, upload.single('profileImage'), uploadProfileImage);

// Remove profile image
router.delete('/image', auth, removeProfileImage);

// Get public profile by ID
router.get('/public/:id', getUserPublicProfile);

module.exports = router;
