const { ethers } = require('ethers');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
 
// Trusted resolver wallet address that can resolve disputes
const TRUSTED_RESOLVER_ADDRESS = '0x5F1e0C26c5c8866f25308d4240409155A9d20686';
 
// List of admin wallet addresses
const ADMIN_WALLET_ADDRESSES = [
    TRUSTED_RESOLVER_ADDRESS,
    '0x126eecbce83e22da5f46dc2be670994db2cd2a8d' ,
    '0x3Ff804112919805fFB8968ad81dBb23b32e8F3f1' // Added user's wallet address
];
 
const validateAdminWallet = async (req, res, next) => {
  try {
    // First validate the JWT token
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
 
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }
 
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }
 
    console.log('Token to verify:', token);
 
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }
 
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload'
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
 
    // Add admin user to request
    req.adminUser = user;
    req.isAdmin = true;
    next();
  } catch (error) {
    console.error('Admin wallet validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating admin access',
      error: error.message
    });
  }
};
 
module.exports = {
  validateAdminWallet,
  TRUSTED_RESOLVER_ADDRESS,
  ADMIN_WALLET_ADDRESSES
};