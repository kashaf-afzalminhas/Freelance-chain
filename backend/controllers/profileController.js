const User = require('../models/User');
const Freelancer = require('../models/Freelancer');
const Client = require('../models/Client');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateProfileUpdate = [
  body('name').optional().isString().trim().isLength({ min: 2, max: 50 }),
  body('bio').optional().isString().trim().isLength({ max: 500 }),
  body('portfolioLinks.linkedin').optional().custom((value) => {
    if (value === '' || value === null || value === undefined) return true;
    return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value);
  }).withMessage('Invalid LinkedIn URL'),
  body('portfolioLinks.github').optional().custom((value) => {
    if (value === '' || value === null || value === undefined) return true;
    return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value);
  }).withMessage('Invalid GitHub URL'),
  body('portfolioLinks.personalPortfolio').optional().custom((value) => {
    if (value === '' || value === null || value === undefined) return true;
    return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value);
  }).withMessage('Invalid portfolio URL'),
  body('skills').optional().isArray(),
  body('experience').optional().isString().trim(),
  body('company').optional().isString().trim()
];

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch role-specific data
    let roleData = {};
    if (user.role === 'freelancer') {
      const freelancer = await Freelancer.findOne({ userId: user._id });
      roleData = { 
        skills: freelancer?.skills || [], 
        experience: freelancer?.experience || ''
      };
    } else if (user.role === 'client') {
      const client = await Client.findOne({ userId: user._id });
      roleData = { 
        company: client?.company || ''
      };
    }

    res.json({ 
      success: true,
      data: { ...user.toObject(), ...roleData }
    });
  } catch (err) {
    console.error('Error in getUserProfile:', err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch user profile",
      error: err.message 
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  console.log('Request received to update profile:', req.body); // Debugging
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const userId = req.user.id;
    const updates = req.body;

    // Ensure portfolioLinks is always an object
    updates.portfolioLinks = updates.portfolioLinks || { linkedin: '', github: '', personalPortfolio: '' };

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Update basic user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: updates.name,
        bio: updates.bio,
        portfolioLinks: updates.portfolioLinks
      },
      { new: true }
    ).select("-password");

    // Update role-specific data
    if (user.role === 'freelancer') {
      await Freelancer.findOneAndUpdate(
        { userId: user._id },
        {
          skills: updates.skills || [],
          experience: updates.experience || ''
        },
        { upsert: true, new: true }
      );
    } else if (user.role === 'client') {
      await Client.findOneAndUpdate(
        { userId: user._id },
        {
          company: updates.company || ''
        },
        { upsert: true, new: true }
      );
    }

    // Fetch updated role-specific data
    let roleData = {};
    if (user.role === 'freelancer') {
      const freelancer = await Freelancer.findOne({ userId: user._id });
      roleData = {
        skills: freelancer?.skills || [],
        experience: freelancer?.experience || ''
      };
    } else if (user.role === 'client') {
      const client = await Client.findOne({ userId: user._id });
      roleData = {
        company: client?.company || ''
      };
    }

    console.log('Profile updated successfully:', { ...updatedUser.toObject(), ...roleData });

    res.json({ 
      success: true,
      data: { ...updatedUser.toObject(), ...roleData }
    });
  } catch (err) {
    console.error('Error in updateUserProfile:', err);
    res.status(500).json({ 
      success: false,
      message: "Failed to update user profile",
      error: err.message 
    });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded" 
      });
    }

    const userId = req.user.id;
    const filePath = `/uploads/profile-images/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId, 
      { profileImage: filePath }, 
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.json({ 
      success: true,
      message: "Profile image uploaded successfully", 
      data: { profileImage: filePath }
    });
  } catch (err) {
    console.error('Error in uploadProfileImage:', err);
    res.status(500).json({ 
      success: false,
      message: "Failed to upload profile image",
      error: err.message 
    });
  }
};

exports.getUserPublicProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("name portfolioLinks profileImage ratings bio role");
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Fetch role-specific data
    let roleData = {};
    if (user.role === 'freelancer') {
      const freelancer = await Freelancer.findOne({ userId: user._id });
      roleData = { 
        skills: freelancer?.skills || [], 
        experience: freelancer?.experience || ''
      };
    } else if (user.role === 'client') {
      const client = await Client.findOne({ userId: user._id });
      roleData = { 
        company: client?.company || ''
      };
    }

    res.json({ 
      success: true,
      data: { ...user.toObject(), ...roleData }
    });
  } catch (err) {
    console.error('Error in getUserPublicProfile:', err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch public profile",
      error: err.message 
    });
  }
};

exports.updatePortfolioLinks = async (req, res) => {
    try {
        const userId = req.user.id;
        const { portfolioLinks } = req.body;
        
        const user = await User.findByIdAndUpdate(
            userId, 
            { portfolioLinks }, 
            { new: true }
        ).select("-password");
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to update portfolio links" });
    }
};

exports.updateSkills = async (req, res) => {
    try {
        const userId = req.user.id;
        const { skills } = req.body;
        
        const user = await User.findByIdAndUpdate(
            userId, 
            { skills }, 
            { new: true }
        ).select("-password");
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to update skills" });
    }
};

exports.updateSkillRatings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { skillRatings } = req.body;
        
        const user = await User.findByIdAndUpdate(
            userId, 
            { skillRatings }, 
            { new: true }
        ).select("-password");
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to update skill ratings" });
    }
};

exports.removeProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: null },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Profile image removed successfully",
      data: { profileImage: null }
    });
  } catch (err) {
    console.error('Error in removeProfileImage:', err);
    res.status(500).json({
      success: false,
      message: "Failed to remove profile image",
      error: err.message
    });
  }
};

// Export validation middleware
exports.validateProfileUpdate = validateProfileUpdate;

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form submitted'); // Debugging

  if (!validateForm()) return;

  try {
    setSubmitting(true);
    console.log('Submitting form data:', formData);

    const response = await updateUserProfile(formData);
    console.log('Update response:', response);

    if (response.data.success) {
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } else {
      toast.error(response.data.message || 'Failed to update profile');
    }
  } catch (err) {
    console.error('Failed to update profile:', err);

    if (err.response?.data?.errors) {
      const newErrors = {};
      err.response.data.errors.forEach(error => {
        newErrors[error.path] = error.msg;
      });
      setErrors(newErrors);
    } else {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  } finally {
    setSubmitting(false);
  }
};