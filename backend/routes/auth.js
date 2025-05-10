const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Client = require('../models/Client');
const Freelancer = require('../models/Freelancer');
const auth = require('../middleware/auth');
const crypto = require('crypto');
const Web3 = require('web3');
const router = express.Router();
// Initialize Web3 with Infura provider (or any public Ethereum node)
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
// Generate a random nonce
const generateNonce = () => crypto.randomBytes(16).toString('hex');

// MetaMask Login: Step 1 - Request Nonce
router.post('/metamask/request', async (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
        return res.status(400).json({ message: 'Wallet address required' });
    }

    try {
        let user = await User.findOne({ walletAddress });

        // If the user does not exist, create a new entry
        if (!user) {
            user = new User({ walletAddress, nonce: generateNonce() });
            await user.save();
        } else {
            // Update the nonce for security
            user.nonce = generateNonce();
            await user.save();
        }

        console.log('Nonce generated for:', walletAddress, user.nonce); // Debugging
        res.status(200).json({ nonce: user.nonce });
    } catch (error) {
        console.error('Error in /metamask/request:', error); // Debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// MetaMask Login: Step 2 - Verify Signature
router.post('/metamask/verify', async (req, res) => {
    console.log('=== MetaMask Verification Request ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);

    const { walletAddress, signature } = req.body;

    // Validate request body
    if (!walletAddress || !signature) {
        console.log('Validation failed:', {
            hasWalletAddress: !!walletAddress,
            hasSignature: !!signature
        });
        return res.status(400).json({ 
            error: 'Missing required fields',
            details: {
                walletAddress: !walletAddress ? 'Wallet address is required' : undefined,
                signature: !signature ? 'Signature is required' : undefined
            }
        });
    }

    try {
        console.log('Looking up user with wallet:', walletAddress.toLowerCase());
        const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
        
        if (!user) {
            console.log('User not found in database');
            return res.status(400).json({ 
                error: 'Wallet not registered',
                details: 'No user found with this wallet address'
            });
        }

        console.log('Found user:', {
            id: user._id,
            walletAddress: user.walletAddress,
            hasNonce: !!user.nonce
        });

        if (!user.nonce) {
            console.log('User has no nonce');
            return res.status(400).json({ 
                error: 'Invalid nonce',
                details: 'User has no nonce associated with their account'
            });
        }

        const message = `Nonce: ${user.nonce}`;
        console.log('Verifying message:', message);

        try {
            const recoveredAddress = web3.eth.accounts.recover(message, signature);
            console.log('Recovery results:', {
                recoveredAddress,
                expectedAddress: walletAddress.toLowerCase(),
                match: recoveredAddress.toLowerCase() === walletAddress.toLowerCase()
            });

            if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
                console.log('Signature verification failed');
                return res.status(401).json({ 
                    error: 'Invalid signature',
                    details: 'The signature does not match the expected wallet address'
                });
            }
        } catch (recoveryError) {
            console.error('Error recovering address:', recoveryError);
            return res.status(400).json({
                error: 'Signature recovery failed',
                details: recoveryError.message
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, walletAddress }, process.env.JWT_SECRET, { expiresIn: '7d' });

        console.log('Verification successful, generating response');
        // Return token and user data
        res.status(200).json({
            message: 'MetaMask login successful',
            token,
            user: {
                _id: user._id,
                walletAddress: user.walletAddress,
                role: user.role,
                name: user.name,
            },
        });
    } catch (error) {
        console.error('Error in /metamask/verify:', error);
        res.status(500).json({ 
            error: 'Server error',
            details: error.message
        });
    }
});
// Check if a wallet address is already registered
router.post('/check-wallet', async (req, res) => {
    const { walletAddress } = req.body;
  
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }
  
    try {
      const user = await User.findOne({ walletAddress });
      res.status(200).json({ exists: !!user });
    } catch (error) {
      console.error('Check wallet error', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Register a new user
  router.post('/register', async (req, res) => {
    const { walletAddress, password } = req.body;
  
    if (!walletAddress || !password) {
      return res.status(400).json({ message: 'Wallet address and password are required' });
    }
  
    try {
      // Check if the wallet address is already registered
      const existingUser = await User.findOne({ walletAddress });
      if (existingUser) {
        return res.status(400).json({ message: 'Wallet address is already registered' });
      }
  
      // Create a new user
      const user = new User({
        walletAddress,
        password, // In a real app, hash the password before saving
        nonce: generateNonce(), // Generate a nonce for MetaMask login
      });
  
      await user.save();
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id, walletAddress }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      // Return token and user data
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          _id: user._id,
          walletAddress: user.walletAddress,
          role: user.role,
          name: user.name,
        },
      });
    } catch (error) {
      console.error('Registration error', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Role Selection
// router.post('/select-role', async (req, res) => {
//     const { userId, role, name, extraData } = req.body;
  
//     try {
//       // Find the user by userId
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Update the user's role and name
//       user.role = role;
//       user.name = name;
//       await user.save();
  
//       // Create a Client or Freelancer profile based on the selected role
//       if (role === 'client') {
//         await Client.create({ userId: user._id, company: extraData.company });
//       } else if (role === 'freelancer') {
//         await Freelancer.create({
//           userId: user._id,
//           skills: extraData.skills,
//           experience: extraData.experience,
//         });
//       }
  
//       res.status(200).json({ message: 'Role assigned successfully', user });
//     } catch (error) {
//       console.error('Role selection error', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
// Role Selection
router.post('/select-role', async (req, res) => {
    const { userId, role, name, extraData } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = role;
        user.name = name;
        await user.save();

        if (role === 'client') {
            await Client.create({ userId: user._id, company: extraData.company });
        } else if (role === 'freelancer') {
            await Freelancer.create({ userId: user._id, skills: extraData.skills, experience: extraData.experience });
        }

        res.status(200).json({ message: 'Role assigned successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Get current users 
router.get('/current-user', auth, (req, res) => {
    res.json(req.user); // The `auth` middleware adds `req.user`
});


module.exports = router;