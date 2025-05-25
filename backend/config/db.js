const mongoose = require('mongoose');

// Fix deprecation warning
mongoose.set('strictQuery', false);

const MONGODB_URI = 'mongodb+srv://wajid:wajid@cluster0.0vndb.mongodb.net/sajid?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    // Use environment variable or fallback to hardcoded URI if not available
    const uri = process.env.MONGO_URI || MONGODB_URI;
    console.log('Connecting to MongoDB database:', uri.split('/').pop().split('?')[0]);
    
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
