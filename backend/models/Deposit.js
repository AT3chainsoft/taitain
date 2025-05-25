const mongoose = require('mongoose');

const DepositSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0.1, 'Amount must be at least 0.1 USDT']
  },
  transactionId: {
    type: String,
    required: [true, 'Please add a transaction ID'],
    unique: true,
    trim: true
  },
  senderWalletAddress: {
    type: String,
    required: [true, 'Please add a sender wallet address'],
    trim: true
  },
  network: {
    type: String,
    required: [true, 'Please specify the network'],
    enum: ['usdt_trc20', 'usdt_erc20', 'usdt_polygon'],
    default: 'usdt_trc20'
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected'],
    default: 'Pending'
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Deposit', DepositSchema);
