const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createDeposit,
  getUserDeposits,
  getAllDeposits,
  approveDeposit,
  rejectDeposit
} = require('../controllers/deposits');

const router = express.Router();

// Protected user routes
router.use(protect);
router.route('/').post(createDeposit);
router.route('/my-deposits').get(getUserDeposits); // Changed from /user to /my-deposits

// Admin routes
router.get('/all', protect, authorize('admin'), getAllDeposits);
router.put('/:id/approve', protect, authorize('admin'), approveDeposit);
router.put('/:id/reject', protect, authorize('admin'), rejectDeposit);

module.exports = router;
