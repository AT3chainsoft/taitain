const mongoose = require('mongoose');

const StakingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageType: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [100, 'Minimum staking amount is 100 USDT']
  },
  weeklyReturnPercent: {
    type: Number,
    required: true
  },
  lockPeriod: {
    type: Number, // in months
    required: true,
    min: 1
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  lastProfitCalculation: {
    type: Date,
    default: Date.now
  },
  profitsEarned: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate profit for a staking package
StakingSchema.methods.calculateProfit = function() {
  // Only calculate profit for active stakings
  if (this.status !== 'Active') {
    return 0;
  }

  const now = new Date();
  const lastCalculation = new Date(this.lastProfitCalculation);
  
  // If less than a day has passed since last calculation, return 0
  if (now - lastCalculation < 24 * 60 * 60 * 1000) {
    return 0;
  }

  // Calculate days since last calculation (max 7 days per calculation to avoid big jumps)
  const daysElapsed = Math.min(
    Math.floor((now - lastCalculation) / (24 * 60 * 60 * 1000)),
    7
  );

  if (daysElapsed <= 0) return 0;

  // Calculate daily profit
  const dailyProfitPercent = this.weeklyReturnPercent / 7;
  const dailyProfit = (this.amount * dailyProfitPercent) / 100;
  const profit = dailyProfit * daysElapsed;

  // Check if staking should be completed
  if (now >= this.endDate && this.status === 'Active') {
    this.status = 'Completed';
  }

  // Update the last calculation date
  this.lastProfitCalculation = now;

  return profit;
};

module.exports = mongoose.model('Staking', StakingSchema);
