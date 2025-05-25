const mongoose = require('mongoose');
require('dotenv').config();

// Fix deprecation warning
mongoose.set('strictQuery', false);

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    
    // Check if MONGO_URI is properly loaded
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('ERROR: MONGO_URI is not defined in environment variables');
      process.exit(1);
    }
    
    // Print just the first part of the URI for security (hide credentials)
    const uriParts = uri.split('@');
    const publicPart = uriParts.length > 1 ? `...@${uriParts[1]}` : 'Invalid URI format';
    console.log('URI:', publicPart);
    
    console.log('Attempting connection...');
    await mongoose.connect(uri, {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });
    
    console.log('MongoDB connected successfully!');
    
    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:');
    
    if (collections.length === 0) {
      console.log('No collections found. Database might be empty.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
};

testConnection();
