const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new project
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    console.log('Creating project with data:', req.body);
    
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

    // Parse requirements array
    let requirements = [];
    if (req.body.requirements) {
      if (Array.isArray(req.body.requirements)) {
        requirements = req.body.requirements;
      } else if (typeof req.body.requirements === 'string') {
        requirements = [req.body.requirements];
      }
    }

    // Process images
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        images.push({
          data: file.buffer.toString('base64'),
          contentType: file.mimetype
        });
      }
    }

    // Create project
    const project = new Project({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      price: price,
      requirements: requirements,
      images: images,
      status: 'active',
      freelancer: req.user.id,
      freelancerName: req.user.name
    });

    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Create project error:', err);
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
router.patch('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Process new images if any
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        data: file.buffer.toString('base64'),
        contentType: file.mimetype
      }));
      project.images = [...project.images, ...newImages];
    }

    // Update other fields
    Object.assign(project, req.body);
    project.updatedAt = Date.now();
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
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