const express = require('express');
const router = express.Router();
const { validateAdminWallet, ADMIN_WALLET_ADDRESSES, getAdminNameByWallet } = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Admin verification endpoint
router.get('/verify', auth, async (req, res) => {
  try {
    const walletAddress = req.query.walletAddress?.toLowerCase();

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        isAdmin: false,
        message: 'Wallet address is required'
      });
    }

    // Check if wallet address is in trusted admin list
    const isAdminWallet = ADMIN_WALLET_ADDRESSES.some(admin => 
      admin.address.toLowerCase() === walletAddress
    );

    if (!isAdminWallet) {
      console.log('Wallet address not in trusted admin list:', walletAddress);
      return res.status(403).json({
        success: false,
        isAdmin: false,
        message: 'Wallet address not in trusted admin list'
      });
    }

    console.log('Looking up user with wallet address:', walletAddress);

    // Find user and verify admin role
    const user = await User.findOne({ 
      walletAddress: walletAddress,
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

    const adminName = getAdminNameByWallet(walletAddress);

    const response = {
      success: true,
      isAdmin: true,
      message: 'Admin access verified',
      user: {
        _id: user._id,
        walletAddress: user.walletAddress,
        role: user.role,
        name: adminName || user.name
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