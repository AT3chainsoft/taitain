const asyncHandler = require('express-async-handler');
const Staking = require('../models/Staking');
const User = require('../models/User');

// @desc    Get all stakings for current user
// @route   GET /api/staking
// @access  Private
exports.getStakings = asyncHandler(async (req, res, next) => {
  const stakings = await Staking.find({ userId: req.user.id });

  res.status(200).json({
    success: true,
    data: stakings
  });
});

// @desc    Get all stakings (admin only)
// @route   GET /api/staking/all
// @access  Private/Admin
exports.getAllStakings = asyncHandler(async (req, res, next) => {
  const stakings = await Staking.find().populate('userId', 'email');

  res.status(200).json({
    success: true,
    count: stakings.length,
    data: stakings
  });
});

// @desc    Create new staking
// @route   POST /api/staking
// @access  Private
exports.createStaking = asyncHandler(async (req, res) => {
  try {
    const { amount, packageType, lockPeriod } = req.body;
    const userId = req.user.id;

    // Check if this is user's first staking
    const isFirstStaking = !(await Staking.exists({ userId }));
    const user = await User.findById(userId);

    // Create staking
    const staking = await Staking.create({
      userId,
      amount,
      packageType,
      lockPeriod,
      weeklyReturnPercent: amount >= 5000 ? 3 : 2.5,
      startDate: new Date(),
      endDate: new Date(Date.now() + lockPeriod * 30 * 24 * 60 * 60 * 1000),
      status: 'Active'
    });

    // If first staking and has referrer, give referral bonus
    if (isFirstStaking && user.referrer) {
      const referrer = await User.findById(user.referrer);
      if (referrer) {
        const bonusAmount = amount * 0.05; // 5% bonus
        referrer.referralEarnings = (referrer.referralEarnings || 0) + bonusAmount;
        referrer.balance = (referrer.balance || 0) + bonusAmount;
        await referrer.save();
        
        console.log(`Referral bonus of ${bonusAmount} USDT paid to ${referrer.email}`);
      }
    }

    res.status(201).json({
      success: true,
      data: staking
    });
  } catch (error) {
    console.error('Staking creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating staking'
    });
  }
});

// @desc    Get single staking
// @route   GET /api/staking/:id
// @access  Private
exports.getStaking = asyncHandler(async (req, res, next) => {
  const staking = await Staking.findById(req.params.id);

  // Check if staking exists
  if (!staking) {
    return res.status(404).json({
      success: false,
      error: 'Staking not found'
    });
  }

  // Make sure user owns staking or is admin
  if (staking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this staking'
    });
  }

  res.status(200).json({
    success: true,
    data: staking
  });
});

// @desc    Calculate profits for all active stakings
// @route   POST /api/staking/calculate-profit
// @access  Private/Admin
exports.calculateProfits = asyncHandler(async (req, res, next) => {
  // Get all active stakings
  const activeStakings = await Staking.find({ status: 'Active' });

  let updatedCount = 0;

  // Calculate profits for each staking
  for (const staking of activeStakings) {
    const profit = staking.calculateProfit();
    
    if (profit > 0) {
      staking.profitsEarned += profit;
      await staking.save();
      updatedCount++;
    }
    
    // Check if staking period is over
    const now = new Date();
    if (now >= staking.endDate && staking.status === 'Active') {
      staking.status = 'Completed';
      await staking.save();
    }
  }

  res.status(200).json({
    success: true,
    updatedCount,
    message: `Updated profits for ${updatedCount} stakings`
  });
});

// Helper function to check if this is the user's first staking
const isFirstStaking = async (userId) => {
  const stakingCount = await Staking.countDocuments({ userId });
  return stakingCount === 0;
};
