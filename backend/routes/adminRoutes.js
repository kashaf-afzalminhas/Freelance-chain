const express = require('express');
const router = express.Router();
const { validateAdminWallet } = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');
const User = require('../models/User');

// Admin verification endpoint
router.get('/verify', validateAdminWallet, async (req, res) => {
  try {
    const { walletAddress } = req.query;
    
    // Find user and verify admin role
    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase(),
      role: 'admin'
    });

    if (!user) {
      return res.status(403).json({
        success: false,
        isAdmin: false,
        message: 'User is not an admin'
      });
    }

    res.json({
      success: true,
      isAdmin: true,
      message: 'Admin access verified',
      user: {
        _id: user._id,
        walletAddress: user.walletAddress,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({
      success: false,
      isAdmin: false,
      message: 'Error verifying admin status'
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
router.patch('/contracts/:contractId/status', validateAdminWallet, adminController.updateContractStatus);

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