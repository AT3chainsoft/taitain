const express = require('express');
const { 
  getStakings,
  getAllStakings,
  createStaking,
  getStaking,
  calculateProfits
} = require('../controllers/staking');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getStakings)
  .post(protect, createStaking);

router
  .route('/all')
  .get(protect, authorize('admin'), getAllStakings);

router
  .route('/calculate-profit')
  .post(protect, authorize('admin'), calculateProfits);

router
  .route('/:id')
  .get(protect, getStaking);

module.exports = router;
