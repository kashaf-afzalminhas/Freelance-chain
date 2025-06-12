const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const http = require('http');
const Web3 = require('web3');
const { initializeSocket } = require('./socket');
const bidRoutes = require('./routes/bidRoutes');
const contractRoutes = require('./routes/contractRoutes');
const workRoutes = require('./routes/workRoutes');
const ipfsRoutes = require('./routes/ipfsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const bidsDir = path.join(uploadsDir, 'bids');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(bidsDir)) {
  fs.mkdirSync(bidsDir, { recursive: true });
}

// Initialize Web3 with Ganache
const ganacheUrl = process.env.GANACHE_URL || 'http://127.0.0.1:7545';
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-admin-wallet'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
   
}));

// Make Web3 available to routes
app.use((req, res, next) => {
    req.web3 = web3;
    next();
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Add request logging middleware
// Request logging middleware for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Static files - Serve uploads directory with proper headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    // Set proper content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.mp4': 'video/mp4'
    };
    
    if (contentTypes[ext]) {
      res.set('Content-Type', contentTypes[ext]);
    }
    
    // Allow cross-origin requests for files
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Database connection

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority'
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        blockchain: web3.isConnected() ? 'connected' : 'disconnected',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/jobs', require('./routes/jobs'));
app.use('/projects', require('./routes/projects'));
app.use('/messages', require('./routes/message'));
app.use('/users', require('./routes/users'));
app.use('/conversations', require('./routes/conversation'));
app.use('/profile', require('./routes/profile'));
app.use('/bids', bidRoutes);
app.use('/contracts', contractRoutes);
app.use('/work', workRoutes);
app.use('/saved-jobs', require('./routes/savedJobs'));
app.use('/api/ipfs', ipfsRoutes);
app.use('/notifications', notificationRoutes);

// Admin routes - Mount at /api/admin
app.use('/api/admin', require('./routes/adminRoutes'));

// API route not found handler
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    
    // Handle specific errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized access'
        });
    }
    
    // Default error
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Initialize Socket.IO
const io = initializeSocket(server);

// Make io accessible to routes
app.set('io', io);

// Server startup
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Blockchain connected to: ${ganacheUrl}`);
    console.log(`Allowed origins: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('Server and MongoDB connection closed');
            process.exit(0);
        });
    });
});