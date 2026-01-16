require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN_WALLET_ADDRESSES = [
  '0x3Ff804112919805fFB8968ad81dBb23b32e8F3f1',
  '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc'
];

const ADMIN_NAMES = {
  '0x3ff804112919805ffb8968ad81dbb23b32e8f3f1': 'Admin 1',
  '0x1a16d8976a56f7efcf2c8f861c055bada335fbdc': 'Admin 2'
};

async function createAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Process each admin wallet address
        for (const walletAddress of ADMIN_WALLET_ADDRESSES) {
            const normalizedAddress = walletAddress.toLowerCase();
            
            // Check if admin user exists
            const adminUser = await User.findOne({
                walletAddress: normalizedAddress,
                role: 'admin'
            });

            if (adminUser) {
                // Update existing admin's name if needed
                if (adminUser.name !== ADMIN_NAMES[normalizedAddress]) {
                    adminUser.name = ADMIN_NAMES[normalizedAddress];
                    await adminUser.save();
                    console.log('Admin user name updated:', {
                        id: adminUser._id,
                        walletAddress: adminUser.walletAddress,
                        name: adminUser.name,
                        role: adminUser.role
                    });
                } else {
                    console.log('Admin user already exists:', {
                        id: adminUser._id,
                        walletAddress: adminUser.walletAddress,
                        name: adminUser.name,
                        role: adminUser.role
                    });
                }
            } else {
                // Create admin user
                const newAdmin = new User({
                    walletAddress: normalizedAddress,
                    role: 'admin',
                    name: ADMIN_NAMES[normalizedAddress]
                });

                await newAdmin.save();
                console.log('Admin user created successfully:', {
                    id: newAdmin._id,
                    walletAddress: newAdmin.walletAddress,
                    name: newAdmin.name,
                    role: newAdmin.role
                });
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

createAdminUser(); 