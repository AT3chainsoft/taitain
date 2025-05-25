require('dotenv').config();

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Defined (not showing for security)' : 'UNDEFINED');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Defined (not showing for security)' : 'UNDEFINED');

// Check if the MONGO_URI is properly formatted
if (process.env.MONGO_URI) {
  const uri = process.env.MONGO_URI;
  if (uri.startsWith('mongodb+srv://') || uri.startsWith('mongodb://')) {
    console.log('MONGO_URI format appears valid');
    // Print database name only
    const dbName = uri.split('/').pop().split('?')[0];
    console.log('Database name:', dbName);
  } else {
    console.log('WARNING: MONGO_URI format may be invalid');
  }
} else {
  console.log('ERROR: MONGO_URI environment variable is not defined');
}
