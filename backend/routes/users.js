const express = require('express');
const { 
  getUsers, 
  getUser, 
  getUserDashboard, 
  deleteUser,
  toggleUserStatus,
  updateProfile, 
  updatePassword,
  updateWithdrawalAddress 
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/', authorize('admin'), getUsers);
router.get('/dashboard', getUserDashboard);
router.get('/:id', authorize('admin'), getUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.put('/:id/toggle-status', authorize('admin'), toggleUserStatus);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.put('/withdrawal-address', updateWithdrawalAddress);

module.exports = router;
