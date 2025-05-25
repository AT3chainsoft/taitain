const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Fix deprecation warning
mongoose.set('strictQuery', false);

const createAdminUser = async () => {
  try {
    // Make sure we're using the MONGO_URI from the environment variables
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      console.error('ERROR: MONGO_URI is not defined in environment variables');
      process.exit(1);
    }
    
    console.log('Connecting to MongoDB...');
    console.log('Using database:', uri.split('/').pop().split('?')[0]);
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB connected successfully');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@titan.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const admin = new User({
      email: 'admin@titan.com',
      password: 'admin123',  // This will be hashed automatically by the User model
      role: 'admin',
      referralCode: 'ADMIN'
    });

    await admin.save();
    console.log('Admin user created successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdminUser();
