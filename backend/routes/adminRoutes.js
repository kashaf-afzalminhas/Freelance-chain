const express = require('express');
const router = express.Router();
const { validateAdminWallet } = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Admin verification endpoint
router.get('/verify', async (req, res) => {
  console.log('Admin verification request received:', {
    headers: req.headers,
    query: req.query
  });

  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided in request');
      return res.status(401).json({
        success: false,
        isAdmin: false,
        message: 'No authentication token provided'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return res.status(401).json({
        success: false,
        isAdmin: false,
        message: 'Invalid authentication token'
      });
    }

    const { walletAddress } = req.query;
    if (!walletAddress) {
      console.log('No wallet address provided in query');
      return res.status(400).json({
        success: false,
        isAdmin: false,
        message: 'Wallet address is required'
      });
    }

    console.log('Looking up user with wallet address:', walletAddress.toLowerCase());

    // Find user and verify admin role
    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase(),
      role: 'admin'
    });

    console.log('User lookup result:', user ? {
      _id: user._id,
      walletAddress: user.walletAddress,
      role: user.role
    } : 'No user found');

    if (!user) {
      return res.status(403).json({
        success: false,
        isAdmin: false,
        message: 'User is not an admin'
      });
    }

    const response = {
      success: true,
      isAdmin: true,
      message: 'Admin access verified',
      user: {
        _id: user._id,
        walletAddress: user.walletAddress,
        role: user.role,
        name: user.name
      }
    };

    console.log('Sending successful response:', response);
    res.json(response);
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({
      success: false,
      isAdmin: false,
      message: 'Error verifying admin status',
      error: error.message
    });
  }
});

// Dashboard
router.get('/dashboard/stats', validateAdminWallet, adminController.getDashboardStats);

// User management
router.get('/users', validateAdminWallet, adminController.getUsers);
router.patch('/users/:userId/status', validateAdminWallet, adminController.updateUserStatus);

// Job management
router.get('/jobs', validateAdminWallet, adminController.getJobs);
router.patch('/jobs/:jobId/status', validateAdminWallet, adminController.updateJobStatus);

// Contract management
router.get('/contracts', validateAdminWallet, adminController.getContracts);
router.get('/contracts/:contractId', validateAdminWallet, adminController.getContractDetails);
router.patch('/contracts/:contractId/status', validateAdminWallet, adminController.updateContractStatus);
router.post('/contracts/:contractId/reject', validateAdminWallet, adminController.rejectWork);

// Dispute management
router.get('/disputes', validateAdminWallet, adminController.getDisputes);
router.get('/disputes/:contractId', validateAdminWallet, adminController.getDisputeDetails);
router.post('/disputes/:contractId/resolve', validateAdminWallet, adminController.resolveDispute);

// Data export
router.get('/export/:type', validateAdminWallet, adminController.exportData);

// System notifications
router.post('/notifications', validateAdminWallet, adminController.sendSystemNotification);

// Additional routes for frontend components
router.get('/proposals', validateAdminWallet, adminController.getProposals);
router.get('/payments', validateAdminWallet, adminController.getPayments);
router.get('/reviews', validateAdminWallet, adminController.getReviews);
router.get('/reports', validateAdminWallet, adminController.getReports);
router.get('/messages', validateAdminWallet, adminController.getMessages);

// Error handling for admin routes
router.use((err, req, res, next) => {
  console.error('Admin route error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

module.exports = router; 