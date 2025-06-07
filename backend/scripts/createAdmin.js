require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN_WALLET_ADDRESS = '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc';

async function createAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Check if admin user exists
        const adminUser = await User.findOne({
            walletAddress: ADMIN_WALLET_ADDRESS.toLowerCase(),
            role: 'admin'
        });

        if (adminUser) {
            console.log('Admin user already exists:', {
                id: adminUser._id,
                walletAddress: adminUser.walletAddress,
                role: adminUser.role
            });
        } else {
            // Create admin user
            const newAdmin = new User({
                walletAddress: ADMIN_WALLET_ADDRESS.toLowerCase(),
                role: 'admin',
                name: 'Admin User'
            });

            await newAdmin.save();
            console.log('Admin user created successfully:', {
                id: newAdmin._id,
                walletAddress: newAdmin.walletAddress,
                role: newAdmin.role
            });
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

createAdminUser(); 