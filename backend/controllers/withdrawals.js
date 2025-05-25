const asyncHandler = require('express-async-handler');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Staking = require('../models/Staking');
const mongoose = require('mongoose');

// @desc    Get all withdrawals for current user
// @route   GET /api/withdrawals
// @access  Private
exports.getWithdrawals = asyncHandler(async (req, res, next) => {
  const withdrawals = await Withdrawal.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: withdrawals.length,
    data: withdrawals
  });
});

// @desc    Get all withdrawals (admin only)
// @route   GET /api/withdrawals/all
// @access  Private/Admin
exports.getAllWithdrawals = asyncHandler(async (req, res, next) => {
  const withdrawals = await Withdrawal.find()
    .populate('userId', 'email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: withdrawals.length,
    data: withdrawals
  });
});

// @desc    Create referral withdrawal request
// @route   POST /api/withdrawals/referral
// @access  Private
exports.createReferralWithdrawal = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.withdrawalWalletAddress) {
      throw new Error('Please set up your withdrawal address in profile settings');
    }

    if (!user.referralEarnings || user.referralEarnings <= 0) {
      throw new Error('No referral earnings available to withdraw');
    }

    const amount = user.referralEarnings;

    // Create withdrawal request
    const withdrawal = new Withdrawal({
      userId: user._id,
      amount,
      type: 'ReferralEarnings',
      status: 'Pending',
      walletAddress: user.withdrawalWalletAddress
    });

    // Reset user's referral earnings
    user.referralEarnings = 0;

    // Save both documents
    await Promise.all([
      withdrawal.save({ session }),
      user.save({ session })
    ]);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      data: withdrawal
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      error: error.message || 'Error processing withdrawal request'
    });
  } finally {
    session.endSession();
  }
});

// @desc    Create new staking withdrawal
// @route   POST /api/withdrawals/staking
// @access  Private
exports.createStakingWithdrawal = asyncHandler(async (req, res) => {
  const { amount, stakingId } = req.body;
  const userId = req.user.id;

  try {
    const staking = await Staking.findOne({
      _id: stakingId,
      userId,
      status: 'Completed'
    });

    if (!staking) {
      return res.status(404).json({
        success: false,
        error: 'Staking not found or not completed'
      });
    }

    if (amount > staking.profitsEarned) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient staking profits'
      });
    }

    const user = await User.findById(userId);

    // Create withdrawal record
    const withdrawal = await Withdrawal.create({
      userId,
      amount,
      type: 'StakingProfit',
      stakingId,
      status: 'Pending',
      walletAddress: user.walletAddress
    });

    // Update staking profits and user balance
    staking.profitsEarned -= amount;
    user.balance -= amount;
    await Promise.all([staking.save(), user.save()]);

    res.status(201).json({
      success: true,
      data: withdrawal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error processing withdrawal request'
    });
  }
});

// @desc    Approve withdrawal
// @route   PUT /api/withdrawals/:id/approve
// @access  Private/Admin
exports.approveWithdrawal = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const withdrawal = await Withdrawal.findById(req.params.id).session(session);
    
    if (!withdrawal) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        error: 'Withdrawal not found'
      });
    }

    if (withdrawal.status !== 'Pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        error: 'Can only approve pending withdrawals'
      });
    }

    const user = await User.findById(withdrawal.userId).session(session);
    
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Deduct the withdrawal amount from the appropriate balance
    if (withdrawal.type === 'ReferralEarnings') {
      // Deduct from both referral earnings and main balance
      user.referralEarnings = Math.max(0, (user.referralEarnings || 0) - withdrawal.amount);
      user.balance = Math.max(0, (user.balance || 0) - withdrawal.amount);
    } else {
      // Regular withdrawal, just deduct from main balance
      user.balance = Math.max(0, (user.balance || 0) - withdrawal.amount);
    }

    // Update withdrawal status and transaction details
    withdrawal.status = 'Approved';
    withdrawal.transactionUrl = req.body.transactionUrl;
    withdrawal.adminComment = req.body.adminComment;
    withdrawal.processedAt = Date.now();
    withdrawal.processedBy = req.user.id;

    // Save both documents
    await Promise.all([
      withdrawal.save({ session }),
      user.save({ session })
    ]);

    await session.commitTransaction();

    res.json({
      success: true,
      data: withdrawal
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Withdrawal approval error:', error);
    res.status(500).json({
      success: false,
      error: 'Error processing withdrawal approval'
    });
  } finally {
    session.endSession();
  }
});

// @desc    Reject withdrawal
// @route   PUT /api/withdrawals/:id/reject
// @access  Private/Admin
exports.rejectWithdrawal = asyncHandler(async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        error: 'Withdrawal request not found'
      });
    }

    // Only allow rejecting pending withdrawals
    if (withdrawal.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        error: 'Can only reject pending withdrawals'
      });
    }

    const user = await User.findById(withdrawal.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Add the amount back to the appropriate balance based on withdrawal type
    if (withdrawal.type === 'ReferralEarnings') {
      user.referralEarnings = (user.referralEarnings || 0) + withdrawal.amount;
    } else {
      user.balance = (user.balance || 0) + withdrawal.amount;
    }

    // Update withdrawal status
    withdrawal.status = 'Rejected';
    withdrawal.rejectionReason = req.body.rejectionReason || 'Rejected by admin';

    // Save both user and withdrawal in a transaction
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await user.save({ session });
        await withdrawal.save({ session });
      });
    } finally {
      await session.endSession();
    }

    res.json({
      success: true,
      data: withdrawal
    });
  } catch (error) {
    console.error('Withdrawal rejection error:', error);
    res.status(500).json({
      success: false,
      error: 'Error rejecting withdrawal'
    });
  }
});
