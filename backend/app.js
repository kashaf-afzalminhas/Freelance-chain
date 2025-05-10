const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const http = require('http');
const Web3 = require('web3');
const setupSocket = require('./config/socket');
const bidRoutes = require('./routes/bidRoutes');
const contractRoutes = require('./routes/contractRoutes');
const workRoutes = require('./routes/workRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Web3 with Ganache
const ganacheUrl = process.env.GANACHE_URL || 'http://127.0.0.1:7545';
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Make Web3 available to routes
app.use((req, res, next) => {
    req.web3 = web3;
    next();
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Socket.IO setup
setupSocket(server);

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