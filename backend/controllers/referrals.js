const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user's referrals
// @route   GET /api/referrals
// @access  Private
exports.getReferrals = asyncHandler(async (req, res) => {
  try {
    // Find users who have this user as their referrer (by ID)
    const referrals = await User.find({ referrer: req.user.id })
      .select('email createdAt')
      .sort({ createdAt: -1 });

    // Get referral earnings from the referrer's user document
    const currentUser = await User.findById(req.user.id);

    console.log(`Found ${referrals.length} referrals for user ${req.user.email}`);

    res.json({
      success: true,
      data: referrals,
      stats: {
        referralCount: referrals.length,
        referralEarnings: currentUser.referralEarnings || 0,
        referralCode: currentUser.referralCode
      }
    });
  } catch (error) {
    console.error('Get referrals error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching referrals',
      data: [],
      stats: {
        referralCount: 0,
        referralEarnings: 0,
        referralCode: ''
      }
    });
  }
});

// @desc    Get user's referral stats
// @route   GET /api/referrals/stats
// @access  Private
exports.getReferralStats = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const referralCount = await User.countDocuments({ referrer: user.referralCode });

    res.json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referralCount,
        referralEarnings: user.referralEarnings || 0,
        referralLink: `${process.env.FRONTEND_URL}/register?ref=${user.referralCode}`
      }
    });
  } catch (error) {
    console.error('Get referral stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching referral stats'
    });
  }
});

// Add a helper function to check referral bonuses
exports.checkReferralBonuses = asyncHandler(async (req, res) => {
  try {
    const referrer = await User.findById(req.user.id);
    const referredUsers = await User.find({ 
      referrer: referrer.referralCode 
    });

    console.log(`Found ${referredUsers.length} referred users for ${referrer.email}`);
    
    res.json({
      success: true,
      count: referredUsers.length,
      data: {
        referralCode: referrer.referralCode,
        referredUsers: referredUsers.map(user => ({
          email: user.email,
          dateJoined: user.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Error checking referral bonuses:', error);
    res.status(500).json({
      success: false,
      error: 'Error checking referral bonuses'
    });
  }
});
