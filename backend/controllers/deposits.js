const asyncHandler = require('express-async-handler');
const Deposit = require('../models/Deposit');
const User = require('../models/User');
const { default: axios } = require('axios');
const NotificationService = require('../utils/notificationService');

// Add Tron configuration
const TRON_API_KEY = process.env.TRON_API_KEY;
const TRON_API_URL = 'https://api.trongrid.io';

// Function to verify USDT TRC20 transaction
const verifyTrc20Transaction = async (txId, expectedAmount, expectedAddress) => {
  try {
    const response = await axios.get(`${TRON_API_URL}/v1/transactions/${txId}`, {
      headers: { 'TRON-PRO-API-KEY': TRON_API_KEY }
    });

    const transaction = response.data;
    
    // Verify transaction details
    if (transaction.ret[0].contractRet === 'SUCCESS' &&
        transaction.contract[0].parameter.value.amount === expectedAmount &&
        transaction.contract[0].parameter.value.to_address === expectedAddress) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Tron API Error:', error);
    return false;
  }
};

// Automatic deposit verification function
const autoVerifyDeposit = async (deposit) => {
  try {
    let isValid = false;

    if (deposit.network === 'trc20') {
      isValid = await verifyTrc20Transaction(
        deposit.transactionId,
        deposit.amount,
        deposit.walletAddress
      );
    }

    if (isValid) {
      // Update deposit status
      deposit.status = 'Confirmed';
      await deposit.save();

      // Update user balance
      const user = await User.findById(deposit.userId);
      user.balance += deposit.amount;
      await user.save();

      console.log(`Deposit ${deposit._id} automatically verified and user balance updated`);
    }
  } catch (error) {
    console.error('Auto-verification error:', error);
  }
};

// Get all deposits (admin only)
exports.getAllDeposits = asyncHandler(async (req, res) => {
  try {
    const deposits = await Deposit.find()
      .populate('userId', 'email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: deposits
    });
  } catch (error) {
    console.error('Error fetching all deposits:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching deposits'
    });
  }
});

// Get user deposits
exports.getDeposits = asyncHandler(async (req, res) => {
  try {
    const deposits = await Deposit.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: deposits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching deposits'
    });
  }
});

// @desc    Get all deposits for current user
// @route   GET /api/deposits
// @access  Private
exports.getDeposits = asyncHandler(async (req, res, next) => {
  const deposits = await Deposit.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: deposits.length,
    data: deposits
  });
});

// @desc    Get all deposits (admin only)
// @route   GET /api/deposits/all
// @access  Private/Admin
exports.getAllDeposits = asyncHandler(async (req, res) => {
  try {
    const deposits = await Deposit.find()
      .populate('userId', 'email') // Include user email
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: deposits
    });
  } catch (error) {
    console.error('Get deposits error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch deposits' });
  }
});

// Create deposit
exports.createDeposit = asyncHandler(async (req, res) => {
  try {
    const { amount, transactionId, network, senderWalletAddress } = req.body;
    const userId = req.user.id;

    console.log('Creating deposit:', { 
      amount, 
      transactionId, 
      network, 
      senderWalletAddress,
      userId 
    });

    // Validate inputs
    if (!amount || amount < 0.1) {
      return res.status(400).json({
        success: false,
        error: 'Minimum deposit amount is 0.1 USDT'
      });
    }

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID is required'
      });
    }

    if (!senderWalletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Sender wallet address is required'
      });
    }

    // Check for duplicate transaction ID
    const existingDeposit = await Deposit.findOne({ transactionId });
    if (existingDeposit) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID already exists'
      });
    }

    // Create deposit
    const deposit = await Deposit.create({
      userId,
      amount,
      transactionId,
      network,
      senderWalletAddress,
      status: 'Pending'
    });

    console.log('Deposit created:', deposit); // Debug log

    // Trigger notifications after successful deposit creation
    await NotificationService.notifyUser(
      req.user.id,
      'deposit',
      'Deposit Received',
      `Your deposit of ${deposit.amount} ${deposit.currency} has been received and is being processed.`,
      deposit._id,  // Just pass the ObjectId, not a URL
      'Deposit'     // The model name as a string, not the ID
    );
    
    await NotificationService.notifyAdmins(
      'deposit',
      'New Deposit Received',
      `A new deposit of ${deposit.amount} ${deposit.currency} has been received from ${req.user.email}.`,
      deposit._id,  // Just pass the ObjectId, not a URL
      'Deposit'     // The model name as a string, not the ID
    );

    res.status(201).json({
      success: true,
      data: deposit
    });
  } catch (error) {
    console.error('Deposit creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating deposit. Please try again.'
    });
  }
});

// Approve deposit (admin only)
exports.approveDeposit = asyncHandler(async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);
    
    if (!deposit) {
      return res.status(404).json({
        success: false,
        error: 'Deposit not found'
      });
    }

    if (deposit.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        error: 'Deposit is not in pending status'
      });
    }

    // Update deposit status
    deposit.status = 'Confirmed';
    await deposit.save();

    // Update user balance
    const user = await User.findById(deposit.userId);
    user.balance += deposit.amount;
    await user.save();

    res.json({
      success: true,
      data: deposit
    });
  } catch (error) {
    console.error('Approve deposit error:', error);
    res.status(500).json({ success: false });
  }
});

// @desc    Reject deposit
// @route   PUT /api/deposits/:id/reject
// @access  Private/Admin
exports.rejectDeposit = asyncHandler(async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);
    if (!deposit) {
      return res.status(404).json({ success: false });
    }

    if (deposit.status !== 'Pending') {
      return res.status(400).json({ success: false });
    }

    deposit.status = 'Rejected';
    await deposit.save();

    res.json({
      success: true,
      data: deposit
    });
  } catch (error) {
    console.error('Reject deposit error:', error);
    res.status(500).json({ success: false });
  }
});

// @desc    Get user deposits
// @route   GET /api/deposits/my-deposits
// @access  Private
exports.getMyDeposits = asyncHandler(async (req, res) => {
  try {
    const deposits = await Deposit.find({ userId: req.user.id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('userId', 'email'); // Populate user details if needed

    console.log(`Fetched ${deposits.length} deposits for user ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: deposits
    });
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching deposits'
    });
  }
});

exports.getUserDeposits = asyncHandler(async (req, res) => {
  try {
    const deposits = await Deposit.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: deposits
    });
  } catch (error) {
    console.error('Error getting user deposits:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching deposits'
    });
  }
});

// Update deposit status
exports.updateDepositStatus = asyncHandler(async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);
    if (!deposit) {
      return res.status(404).json({ success: false, error: 'Deposit not found' });
    }

    deposit.status = req.body.status;
    await deposit.save();

    // Notify user about status change
    if (req.body.status === 'approved') {
      await NotificationService.notifyUser(
        deposit.userId,
        'deposit',
        'Deposit Approved',
        `Your deposit of ${deposit.amount} ${deposit.currency} has been approved and added to your account.`,
        `/dashboard/deposits/${deposit._id}`,
        deposit._id,
        'Deposit'
      );
    } else if (req.body.status === 'rejected') {
      await NotificationService.notifyUser(
        deposit.userId,
        'deposit',
        'Deposit Rejected',
        `Your deposit of ${deposit.amount} ${deposit.currency} has been rejected. Please contact support for assistance.`,
        `/dashboard/deposits/${deposit._id}`,
        deposit._id,
        'Deposit'
      );
    }

    res.json({
      success: true,
      data: deposit
    });
  } catch (error) {
    console.error('Update deposit status error:', error);
    res.status(500).json({ success: false, error: 'Failed to update deposit status' });
  }
});
