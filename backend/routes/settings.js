const express = require('express');
const { getPublicWalletAddresses } = require('../controllers/adminSettings');

const router = express.Router();

// Public routes
router.get('/wallet-addresses', getPublicWalletAddresses);

module.exports = router;
