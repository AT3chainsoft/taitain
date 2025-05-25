const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [1, 'Minimum withdrawal amount is 1 USDT']
  },
  type: {
    type: String,
    enum: ['StakingProfit', 'ReferralEarnings'],
    required: true
  },
  stakingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staking'
  },
  walletAddress: {
    type: String,
    required: [true, 'Please add a wallet address']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  rejectionReason: {
    type: String
  },
  transactionUrl: {
    type: String,
    trim: true
  },
  adminComment: {
    type: String,
    trim: true
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
