const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.set('strictQuery', false);

const fixReferrals = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully');

    // Find all users with referrer field but no referredBy
    const usersToFix = await User.find({
      referrer: { $exists: true, $ne: null },
      referredBy: null
    });

    console.log(`Found ${usersToFix.length} users to fix`);

    for (const user of usersToFix) {
      // Find the referrer user
      const referrer = await User.findById(user.referrer);
      if (referrer) {
        console.log(`\nFixing user: ${user.email}`);
        console.log(`Setting referredBy to: ${referrer.referralCode}`);
        
        user.referredBy = referrer.referralCode;
        await user.save();
        
        console.log('✅ Updated successfully');
      }
    }

    console.log('\nMigration completed');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixReferrals();
