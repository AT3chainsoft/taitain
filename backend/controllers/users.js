const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Staking = require('../models/Staking');
const Deposit = require('../models/Deposit');
const Withdrawal = require('../models/Withdrawal');

// @desc    Update user info
// @route   PUT /api/users
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    const { walletAddress } = req.body;
    
    // Fields to update
    const fieldsToUpdate = {};
    if (walletAddress) fieldsToUpdate.walletAddress = walletAddress;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
exports.getUserDashboard = asyncHandler(async (req, res, next) => {
  try {
    // Get user with referral info
    const user = await User.findById(req.user.id);
    
    // Get stakings
    const stakings = await Staking.find({ userId: req.user.id });
    
    // Calculate stats
    const activeStakings = stakings.filter(staking => staking.status === 'Active');
    const completedStakings = stakings.filter(staking => staking.status === 'Completed');
    const totalStaked = stakings.reduce((sum, staking) => sum + staking.amount, 0);
    const totalProfit = stakings.reduce((sum, staking) => sum + staking.profitsEarned, 0);
    
    res.status(200).json({
      success: true,
      data: {
        balance: user.balance,
        referralEarnings: user.referralEarnings,
        totalStaked,
        totalProfit,
        activeStakingsCount: activeStakings.length,
        completedStakingsCount: completedStakings.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Update user balance (admin only)
// @route   PUT /api/users/:id/balance
// @access  Private/Admin
exports.updateUserBalance = asyncHandler(async (req, res, next) => {
  if (!req.body.balance && req.body.balance !== 0) {
    return res.status(400).json({
      success: false,
      error: 'Please provide balance'
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Update user balance
  user.balance = req.body.balance;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Don't allow deleting own account
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete own account'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Block/Unblock a user
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
exports.toggleUserStatus = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Don't allow blocking own account
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot change status of own account'
      });
    }

    // Toggle status
    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Update user's withdrawal wallet address
// @route   PUT /api/users/withdrawal-address
// @access  Private
exports.updateWithdrawalAddress = asyncHandler(async (req, res) => {
  const { withdrawalWalletAddress } = req.body;

  if (!withdrawalWalletAddress) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a wallet address'
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { withdrawalWalletAddress },
      { new: true }
    );

    res.json({
      success: true,
      data: {
        withdrawalWalletAddress: user.withdrawalWalletAddress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error updating withdrawal address'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  
  // Remove sensitive fields that shouldn't be updated directly
  delete updates.password;
  delete updates.role;
  delete updates.balance;
  delete updates.referralEarnings;
  
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error updating profile'
    });
  }
});

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error updating password'
    });
  }
});
