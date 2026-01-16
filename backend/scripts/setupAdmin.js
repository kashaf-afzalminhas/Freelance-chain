const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const ADMIN_WALLET_ADDRESSES = [
    {
        address: '0x5F1e0C26c5c8866f25308d4240409155A9d20686',
        name: 'Admin 1'
    },
    {
        address: '0x126eecbce83e22da5f46dc2be670994db2cd2a8d',
        name: 'Admin 2'
    },
    {
        address: '0x3Ff804112919805fFB8968ad81dBb23b32e8F3f1',
        name: 'Admin 2'
    },
    {
        address: '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc',
        name: 'Admin 2'
    }
];

async function setupAdmins() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Process each admin wallet
        for (const admin of ADMIN_WALLET_ADDRESSES) {
            const walletAddress = admin.address.toLowerCase();
            
            // Check if admin user already exists
            let adminUser = await User.findOne({ walletAddress });
            
            if (adminUser) {
                // Update existing user to admin role
                adminUser.role = 'admin';
                adminUser.name = admin.name;
                await adminUser.save();
                console.log(`Updated admin user: ${admin.name} (${walletAddress})`);
            } else {
                // Create new admin user
                adminUser = new User({
                    walletAddress,
                    role: 'admin',
                    name: admin.name
                });
                await adminUser.save();
                console.log(`Created new admin user: ${admin.name} (${walletAddress})`);
            }
        }

        console.log('Admin setup completed successfully');
    } catch (error) {
        console.error('Error setting up admins:', error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

// Run the setup
setupAdmins(); 