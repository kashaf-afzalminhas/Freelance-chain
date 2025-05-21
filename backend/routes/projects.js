const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'projects');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'projectMedia-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'application/pdf', 
    'video/mp4', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.ms-powerpoint', // .ppt
    'text/plain', // .txt
    'application/zip', // .zip
    'application/x-zip-compressed' // .zip
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Supported formats: ${allowedTypes.join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

// Helper function to map mimetype to schema type
function getMediaType(mimetype) {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype === 'application/pdf') return 'pdf';
  // Consider other document types
  if (
    mimetype === 'application/msword' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimetype === 'application/vnd.ms-excel' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    mimetype === 'application/vnd.ms-powerpoint' ||
    mimetype === 'text/plain' ||
    mimetype === 'application/zip' ||
    mimetype === 'application/x-zip-compressed'
  ) return 'document';
  return 'document'; // Default to document
}

// Helper function to get file URL
const getFileUrl = (filename) => {
  return `/uploads/projects/${filename}`;
};

// Get user's projects
router.get('/my-projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ freelancer: req.user.id })
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching user projects:', err);
    res.status(500).json({ 
      message: 'Error fetching your projects',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Create a new project
router.post('/', auth, upload.array('media', 10), async (req, res) => {
  try {
    console.log('Creating project with data:', req.body);
    console.log('Received files:', req.files);
    
    // Validate required fields
    const requiredFields = ['title', 'category', 'description', 'price'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Parse price as float
    const price = parseFloat(req.body.price);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    // Process uploaded files
    const projectMedia = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        projectMedia.push({
          url: getFileUrl(file.filename),
          type: getMediaType(file.mimetype),
          name: file.originalname,
          size: file.size,
          uploadedAt: new Date()
        });
      });
    }

    // Create project
    const project = new Project({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      price: price,
      media: projectMedia,
      status: 'active',
      freelancer: req.user.id,
      freelancerName: req.user.name
    });

    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Create project error:', err);
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: err.message,
        error: err.code
      });
    } else if (err.message.startsWith('Invalid file type')) {
      return res.status(400).json({
        message: err.message
      });
    }
    res.status(400).json({ 
      message: 'Error creating project',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Invalid project data'
    });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all projects...');
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .populate('freelancer', 'name');
    
    console.log('Found projects:', projects.length);
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ 
      message: 'Error fetching projects',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('freelancer', 'name');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a project
router.patch('/:id', auth, upload.array('media', 10), async (req, res) => {
  try {
    console.log('Updating project:', req.params.id);
    console.log('Update data (req.body):', req.body);
    console.log('Received files (req.files):', req.files);

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // --- Handle Media Updates ---
    let updatedMedia = [];

    // 1. Include existing files that were not removed
    const existingMediaData = req.body.existingMedia;
    let existingMediaUrlsToKeep = [];

    if (existingMediaData) {
      if (Array.isArray(existingMediaData)) {
        existingMediaUrlsToKeep = existingMediaData;
      } else if (typeof existingMediaData === 'string') {
        existingMediaUrlsToKeep = [existingMediaData];
      }
    }
    
    console.log('Existing media URLs to keep:', existingMediaUrlsToKeep);

    // Find the full media objects from the existing project based on URLs
    if (existingMediaUrlsToKeep.length > 0 && project.media) {
      updatedMedia = project.media.filter(mediaItem =>
        existingMediaUrlsToKeep.includes(mediaItem.url)
      );
    }

    // 2. Add newly uploaded files from req.files
    if (req.files && req.files.length > 0) {
      const newMedia = req.files.map(file => ({
        url: getFileUrl(file.filename),
        type: getMediaType(file.mimetype),
        name: file.originalname,
        size: file.size,
        uploadedAt: new Date()
      }));
      updatedMedia = [...updatedMedia, ...newMedia];
    }

    // Update the media array in the project document
    project.media = updatedMedia;

    // Update other fields if provided
    if (req.body.title !== undefined) project.title = req.body.title;
    if (req.body.category !== undefined) project.category = req.body.category;
    if (req.body.description !== undefined) project.description = req.body.description;
    if (req.body.price !== undefined) project.price = parseFloat(req.body.price);
    if (req.body.status !== undefined) project.status = req.body.status;

    project.updatedAt = Date.now();
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    console.error('Update project error:', err);
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: err.message,
        error: err.code
      });
    } else if (err.message && err.message.startsWith('Invalid file type')) {
      return res.status(400).json({
        message: err.message
      });
    } else if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error: ' + messages.join(', ')
      });
    }
    res.status(400).json({ message: err.message || 'Error updating project' });
  }
});

// Delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true, 
      message: 'Project deleted successfully' 
    });

  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ message: err.message || 'Error deleting project' });
  }
});

module.exports = router;