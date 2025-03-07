const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Client = require('../models/Client');
const Freelancer = require('../models/Freelancer');
const router = express.Router();

// Email Transporter (For Sending Verification Code)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// Helper Function to Send Verification Code
const sendVerificationCode = async (email, code) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${code}`,
    });
};

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email.endsWith('@gmail.com')) {
        return res.status(400).json({ message: 'Only Google-validated emails are allowed' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        user = new User({ email, password: hashedPassword, verificationCode });
        await user.save();

        await sendVerificationCode(email, verificationCode);
        res.status(201).json({ message: 'Verification code sent to email', userId: user._id });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
//selectrole
router.post('/select-role', async (req, res) => {
    const { userId, role, name, extraData } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = role;
        await user.save();

        if (role === 'client') {
            await Client.create({ userId: user._id, name, company: extraData });
        } else if (role === 'freelancer') {
            await Freelancer.create({ userId: user._id, name, skills: extraData.skills, experience: extraData.experience });
        }

        res.status(200).json({ message: 'Role assigned successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/metamask/request', async (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) return res.status(400).json({ message: 'Wallet address required' });

    try {
        let user = await User.findOne({ walletAddress });

        // If the user does not exist, create a new entry
        if (!user) {
            user = new User({ walletAddress, nonce: crypto.randomBytes(16).toString('hex') });
            await user.save();
        } else {
            // Update the nonce for security
            user.nonce = crypto.randomBytes(16).toString('hex');
            await user.save();
        }

        res.status(200).json({ nonce: user.nonce });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
const Web3 = require('web3');

router.post('/metamask/verify', async (req, res) => {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
        return res.status(400).json({ message: 'Missing wallet address or signature' });
    }

    try {
        const user = await User.findOne({ walletAddress });
        if (!user) return res.status(400).json({ message: 'Wallet not registered' });

        const web3 = new Web3();
        const message = `Nonce: ${user.nonce}`;

        const recoveredAddress = web3.eth.accounts.recover(message, signature);

        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(401).json({ message: 'Invalid signature' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, walletAddress }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ message: 'MetaMask login successful', token });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/verify', async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (user.verified) return res.status(400).json({ message: 'User already verified' });

        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        user.verified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'User not found' });

        if (!user.verified) return res.status(400).json({ message: 'Email not verified' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;