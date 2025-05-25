const express = require('express');
const { protect } = require('../middleware/auth');
const { getReferrals, getReferralStats } = require('../controllers/referrals');

const router = express.Router();

router.use(protect);

router.get('/', getReferrals);
router.get('/stats', getReferralStats);

module.exports = router;
