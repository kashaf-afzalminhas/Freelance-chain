const { ethers } = require('ethers');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const ADMIN_WALLET_ADDRESS = '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc';

const validateAdminWallet = async (req, res, next) => {
  try {
    // First validate the JWT token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    // Find user by ID from token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: User is not an admin'
      });
    }

    // Validate wallet address
    const walletAddress = req.query.walletAddress || req.body.walletAddress;
    if (!walletAddress) {
      return res.status(401).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    // Normalize addresses for comparison
    const normalizedAdminAddress = ADMIN_WALLET_ADDRESS.toLowerCase();
    const normalizedUserAddress = walletAddress.toLowerCase();

    if (normalizedUserAddress !== normalizedAdminAddress) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Invalid admin wallet address'
      });
    }

    // Add admin user to request
    req.adminUser = user;
    req.isAdmin = true;
    next();
  } catch (error) {
    console.error('Admin wallet validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating admin access'
    });
  }
};

module.exports = {
  validateAdminWallet,
  ADMIN_WALLET_ADDRESS
}; 