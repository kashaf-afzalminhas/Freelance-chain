const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            console.log('No token provided in request');
            return res.status(401).json({ 
                success: false,
                message: 'No token, authorization denied' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded || !decoded.userId) {
            console.log('Invalid token structure:', decoded);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token structure' 
            });
        }

        // Find user by id
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            console.log('User not found for ID:', decoded.userId);
            return res.status(401).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ 
            success: false,
            message: 'Token is not valid',
            error: error.message 
        });
    }
};

module.exports = auth;