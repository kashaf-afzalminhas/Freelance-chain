const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const ADMIN_WALLET_ADDRESSES = [
  '0x3Ff804112919805fFB8968ad81dBb23b32e8F3f1',
  '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc'
];

const checkAndFixAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

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

    // Process each admin wallet address
    for (const walletAddress of ADMIN_WALLET_ADDRESSES) {
      const normalizedAddress = walletAddress.toLowerCase();
      console.log(`\nChecking admin wallet: ${normalizedAddress}`);

      // Find admin user
      const adminUser = await User.findOne({
        walletAddress: normalizedAddress
      });

      if (!adminUser) {
        console.log('Admin user not found. Creating new admin user...');
        const newAdmin = new User({
          walletAddress: normalizedAddress,
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
        console.log('Found existing admin user:', {
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
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAndFixAdmin(); 