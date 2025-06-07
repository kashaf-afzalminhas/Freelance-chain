const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkAndFixAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const ADMIN_WALLET = '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc';

    // Find all users
    const allUsers = await User.find({});
    console.log('\nAll users in database:');
    allUsers.forEach(user => {
      console.log({
        walletAddress: user.walletAddress,
        role: user.role,
        _id: user._id
      });
    });

    // Find admin user
    const adminUser = await User.findOne({
      walletAddress: { $regex: new RegExp(`^${ADMIN_WALLET}$`, 'i') }
    });

    if (!adminUser) {
      console.log('\nAdmin user not found. Creating new admin user...');
      const newAdmin = new User({
        walletAddress: ADMIN_WALLET,
        role: 'admin',
        name: 'Admin User'
      });
      await newAdmin.save();
      console.log('New admin user created:', {
        walletAddress: newAdmin.walletAddress,
        role: newAdmin.role,
        _id: newAdmin._id
      });
    } else {
      console.log('\nFound existing admin user:', {
        walletAddress: adminUser.walletAddress,
        role: adminUser.role,
        _id: adminUser._id
      });

      // Update role if not admin
      if (adminUser.role !== 'admin') {
        console.log('Updating user role to admin...');
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('User role updated to admin');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAndFixAdmin(); 