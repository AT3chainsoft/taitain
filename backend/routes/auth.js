const express = require('express');
const passport = require('passport');
const { 
  register, 
  login,
  registerWallet,
  walletLogin, 
  getMe, 
  updateDetails, 
  forgotPassword, 
  resetPassword,
  googleCallback,
  getWalletNonce,
  googleAuth
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Regular auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/register-wallet', registerWallet); // Ensure this line exists
router.post('/wallet-login', walletLogin);
router.get('/wallet-nonce', getWalletNonce);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Google OAuth routes
router.get('/google', googleAuth);

router.get(
  '/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed` 
  }),
  googleCallback
);

module.exports = router;
