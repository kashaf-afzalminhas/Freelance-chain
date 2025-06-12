const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const ADMIN_WALLET = '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc';

const cleanupAdminUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all admin users
    const adminUsers = await User.find({
      walletAddress: { $regex: new RegExp(`^${ADMIN_WALLET}$`, 'i') }
    });

    console.log('Found admin users:', adminUsers);

    if (adminUsers.length > 1) {
      // Keep the first admin user and delete the rest
      const [keepUser, ...deleteUsers] = adminUsers;
      
      for (const user of deleteUsers) {
        await User.findByIdAndDelete(user._id);
        console.log('Deleted duplicate admin user:', user._id);
      }

      // Ensure the kept user has correct wallet address case
      keepUser.walletAddress = ADMIN_WALLET;
      await keepUser.save();
      console.log('Updated kept admin user wallet address case');
    }

    console.log('Cleanup completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

cleanupAdminUsers(); 