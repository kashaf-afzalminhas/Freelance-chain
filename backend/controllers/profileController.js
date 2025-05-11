const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const Freelancer = require('../models/Freelancer');
const Client = require('../models/Client');
const z = require('zod');

// Validation middleware
const validateProfileUpdate = [
  body('name').optional().isString().trim(),
  body('portfolioLinks.linkedin').optional().isURL().withMessage('LinkedIn URL must be valid'),
  body('portfolioLinks.github').optional().isURL().withMessage('GitHub URL must be valid'),
  body('portfolioLinks.personalPortfolio').optional().isURL().withMessage('Personal Portfolio URL must be valid'),
  body('bio').optional().isString().trim(),
  body('skills').optional().isArray(),
  body('experience').optional().isString().trim(),
  body('company').optional().isString().trim()
];

const profileSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),
    bio: z.string()
        .max(500, "Bio cannot exceed 500 characters")
        .optional()
        .nullable(),
    portfolioLinks: z.array(z.string().url()),
    skills: z.array(z.string()),
    skillRatings: z.array(z.object({
        skill: z.string(),
        rating: z.number().min(0).max(5)
    }))
});

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
        experience: freelancer?.experience 
      };
    } else if (user.role === 'client') {
      const client = await Client.findOne({ userId: user._id });
      roleData = { 
        company: client?.company 
      };
    }

    res.json({ ...user.toObject(), ...roleData });
  } catch (err) {
    console.error('Error in getUserProfile:', err);
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
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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

    res.json({ ...updatedUser.toObject(), ...roleData });
  } catch (err) {
    console.error('Error in updateUserProfile:', err);
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
    const user = await User.findById(userId).select("name portfolioLinks profileImage ratings bio role");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch role-specific data
    let roleData = {};
    if (user.role === 'freelancer') {
      const freelancer = await Freelancer.findOne({ userId: user._id });
      roleData = { 
        skills: freelancer?.skills || [], 
        experience: freelancer?.experience 
      };
    } else if (user.role === 'client') {
      const client = await Client.findOne({ userId: user._id });
      roleData = { 
        company: client?.company 
      };
    }

    res.json({ ...user.toObject(), ...roleData });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch public profile" });
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

// Export validation middleware
exports.validateProfileUpdate = validateProfileUpdate;

// console.log({
//   getUserProfile: exports.getUserProfile,
//   updateUserProfile: exports.updateUserProfile,
//   uploadProfileImage: exports.uploadProfileImage,
//   getUserPublicProfile: exports.getUserPublicProfile,
// });