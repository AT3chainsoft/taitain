const mongoose = require('mongoose');
const User = require('../models/User');
const Staking = require('../models/Staking');
require('dotenv').config();

mongoose.set('strictQuery', false); // Add this line to fix deprecation warning

const checkAndFixReferralBonuses = async () => {
  try {
    console.log('Connecting to MongoDB:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully');

    // First, let's log all users and their referral codes
    const allUsers = await User.find({});
    console.log('\nAll users in system:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`User: ${user.email}`);
      console.log(`Referral Code: ${user.referralCode}`);
      console.log(`Referred By: ${user.referredBy}`);
      console.log('------------------------');
    });

    // Get all users who were referred
    const referredUsers = await User.find({ 
      referredBy: { $exists: true, $ne: null, $ne: '' } 
    });
    
    console.log(`\nFound ${referredUsers.length} referred users`);

    for (const user of referredUsers) {
      console.log(`\nProcessing user: ${user.email}`);
      console.log(`Referred by code: ${user.referredBy}`);

      // Find their stakings
      const stakings = await Staking.find({ 
        userId: user._id,
        status: { $in: ['Active', 'Completed'] }
      }).sort({ createdAt: 1 });

      console.log(`Found ${stakings.length} stakings for user`);

      if (stakings.length > 0) {
        const firstStaking = stakings[0];
        console.log(`First staking amount: ${firstStaking.amount} USDT`);

        // Find referrer
        const referrer = await User.findOne({ referralCode: user.referredBy });
        
        if (referrer) {
          console.log(`Found referrer: ${referrer.email}`);
          const bonusAmount = firstStaking.amount * 0.05; // 5% bonus

          // Update referrer's earnings
          const previousEarnings = referrer.referralEarnings || 0;
          referrer.referralEarnings = previousEarnings + bonusAmount;
          referrer.balance = (referrer.balance || 0) + bonusAmount;
          
          await referrer.save();

          console.log(`Updated referrer earnings:`);
          console.log(`Previous: $${previousEarnings}`);
          console.log(`Added bonus: $${bonusAmount}`);
          console.log(`New total: $${referrer.referralEarnings}`);
        } else {
          console.log(`⚠️ Referrer not found for code: ${user.referredBy}`);
        }
      }
    }

    console.log('\nCompleted checking referral bonuses');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAndFixReferralBonuses();
