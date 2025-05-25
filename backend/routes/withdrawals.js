const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getWithdrawals,
  createReferralWithdrawal,
  createStakingWithdrawal,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal
} = require('../controllers/withdrawals');

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/', getWithdrawals);
router.post('/referral', protect, createReferralWithdrawal);
router.post('/staking', createStakingWithdrawal);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllWithdrawals);
router.put('/:id/approve', protect, authorize('admin'), approveWithdrawal);
router.put('/:id/reject', protect, authorize('admin'), rejectWithdrawal);

module.exports = router;
