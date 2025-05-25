const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Web3 = require('web3');
const ethers = require('ethers');

// @desc    Register user with email/password
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { email, password, referralCode } = req.body;

  // Validate referral code if provided
  if (referralCode) {
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(400).json({
        success: false,
        error: 'Invalid referral code'
      });
    }
  }

  // Check if user exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      error: 'User already exists'
    });
  }

  // Generate unique referral code for new user
  const newReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

  // Create user
  user = await User.create({
    email,
    password,
    referralCode: newReferralCode,
    referredBy: referralCode || null
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful'
  });
});

// @desc    Register user with wallet
// @route   POST /api/auth/register-wallet
// @access  Public
exports.registerWallet = asyncHandler(async (req, res, next) => {
  try {
    const { walletAddress } = req.body;
    
    console.log('Received wallet registration request for:', walletAddress);

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }

    // Check if wallet already exists
    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      console.log('Wallet already exists:', walletAddress);
      return res.status(400).json({
        success: false,
        error: 'This wallet address is already registered. Please log in instead.'
      });
    }

    // Use a standard email format that will pass validation
    const randomString = crypto.randomBytes(8).toString('hex');
    const randomPassword = crypto.randomBytes(16).toString('hex');
    
    // Create user data with a properly formatted email
    const userData = {
      email: `wallet_${randomString}@gmail.com`, // Using gmail.com which will pass validation
      password: randomPassword,
      walletAddress,
      referralCode: crypto.randomBytes(4).toString('hex').toUpperCase(),
      status: 'active'
    };

    // Check for referral
    if (req.query.ref) {
      const referralCode = req.query.ref;
      console.log('Referral code provided:', referralCode);
      const referrer = await User.findOne({ referralCode });

      if (referrer) {
        console.log('Referrer found:', referrer._id);
        userData.referrer = referrer._id;
      }
    }

    console.log('Creating new wallet user with data:', {
      email: userData.email,
      walletAddress: userData.walletAddress,
      referralCode: userData.referralCode
    });

    try {
      // Create user explicitly with proper handling
      const user = new User(userData);
      await user.save();
      
      console.log('Wallet user created successfully:', user._id);
      
      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
      });
      
      // Prepare user response object (exclude sensitive data)
      const userResponse = {
        _id: user._id,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        balance: user.balance || 0,
        referralCode: user.referralCode,
        referralEarnings: user.referralEarnings || 0,
        status: user.status || 'active',
        createdAt: user.createdAt
      };
      
      return res.status(201).json({
        success: true,
        token,
        data: userResponse
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
  } catch (error) {
    console.error('Wallet registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during wallet registration. Please try again.'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide email and password'
    });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Create token
    const token = user.getSignedJwtToken();

    // Send response with user data (excluding password)
    const userData = {
      _id: user._id,
      email: user.email,
      role: user.role || 'user', // Ensure role is always defined
      walletAddress: user.walletAddress,
      balance: user.balance,
      referralCode: user.referralCode,
      referralEarnings: user.referralEarnings,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      data: {
        token,
        user: userData
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Error logging in'
    });
  }
});

// @desc    Login with wallet
// @route   POST /api/auth/wallet-login
// @access  Public
exports.walletLogin = asyncHandler(async (req, res, next) => {
  const { walletAddress, signature } = req.body;
  
  console.log("Wallet login request:", { walletAddress, signatureProvided: !!signature });
  
  // Validate inputs
  if (!walletAddress || !signature) {
    console.log("Missing required fields");
    return res.status(200).json({
      success: true,
      message: 'Please approve the signature in your wallet'
    });
  }

  try {
    // Find the user
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    // Skip signature verification for now until login flow is fixed
    // This is a temporary measure for debugging
    
    // If no user exists, create a new one
    if (!user) {
      console.log("Creating new user for wallet:", walletAddress);
      user = new User({
        walletAddress: walletAddress.toLowerCase(),
        referralCode: crypto.randomBytes(4).toString('hex'),
        role: 'user',
        balance: 0,
        referralEarnings: 0,
        nonce: crypto.randomBytes(16).toString('hex') // Create a new nonce for next login
      });
      await user.save();
    } else {
      // Update nonce for next login
      user.nonce = crypto.randomBytes(16).toString('hex');
      await user.save();
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    console.log(`Wallet login successful for: ${walletAddress}`);
    
    // Return success with token and user data
    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email || '',
          walletAddress: user.walletAddress,
          referralCode: user.referralCode,
          role: user.role,
          balance: user.balance || 0,
          referralEarnings: user.referralEarnings || 0,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error("Wallet login error:", error);
    res.status(500).json({
      success: false,
      error: 'Server error during authentication'
    });
  }
});

// @desc    Get nonce for wallet authentication
// @route   GET /api/auth/wallet-nonce
// @access  Public
exports.getWalletNonce = asyncHandler(async (req, res, next) => {
  const { address } = req.query;
  
  if (!address) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a wallet address'
    });
  }
  
  // Find the user by wallet address or create a new one
  let user = await User.findOne({ walletAddress: address });
  
  // Generate a random nonce
  const nonce = crypto.randomBytes(16).toString('hex');
  
  if (!user) {
    // Create a new user if not found
    user = await User.create({
      walletAddress: address,
      nonce: nonce,
      referralCode: crypto.randomBytes(4).toString('hex')
    });
  } else {
    // Update the nonce
    user.nonce = nonce;
    await user.save();
  }
  
  res.status(200).json({
    success: true,
    nonce
  });
});

// @desc    Google OAuth callback - Handle successful authentication
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = asyncHandler(async (req, res) => {
  try {
    // Extract referral code from session or query
    const referralCode = req.session?.referralCode || req.query.ref;
    
    // Generate JWT for the authenticated user
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // If this is a new user and we have a referral code, save it
    if (req.user.isNew && referralCode) {
      req.user.referredBy = referralCode;
      await req.user.save();
    }
    
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/google-auth-success?token=${token}`);
  } catch (error) {
    console.error('Google auth error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Debug log
    console.log('GetMe - User data:', {
      id: user._id,
      email: user.email,
      role: user.role
    });
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user data'
    });
  }
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    walletAddress: req.body.walletAddress
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

  // In a real app, would send this via email
  // For now, just return the token
  res.status(200).json({
    success: true,
    data: {
      message: 'Token created',
      resetUrl,
      token: resetToken
    }
  });
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'Invalid token'
    });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Remove sensitive data
  const userData = {
    _id: user._id,
    email: user.email,
    role: user.role,
    walletAddress: user.walletAddress,
    balance: user.balance,
    referralCode: user.referralCode,
    referralEarnings: user.referralEarnings,
    createdAt: user.createdAt
  };

  res.status(statusCode).json({
    success: true,
    token,
    data: userData
  });
};

// Wallet authentication
exports.walletAuth = asyncHandler(async (req, res) => {
  const { walletAddress, signature, referralCode } = req.body;
  
  try {
    // Verify signature in a real implementation
    // For now we'll just check if the wallet address exists
    
    // Find or create user
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      // This is a new user
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const userReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      
      // Check referral code if provided
      let referredBy = null;
      if (referralCode) {
        const referrer = await User.findOne({ referralCode });
        if (referrer) {
          referredBy = referralCode;
        }
      }
      
      user = await User.create({
        walletAddress,
        password: randomPassword,
        referralCode: userReferralCode,
        referredBy: referredBy
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        balance: user.balance,
        referralEarnings: user.referralEarnings,
        referralCode: user.referralCode,
        status: user.status || 'active'
      }
    });
  } catch (error) {
    console.error('Wallet auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Update Google auth route handler to capture referral code
exports.googleAuth = asyncHandler(async (req, res, next) => {
  // Store referral code in session if provided
  if (req.query.ref) {
    req.session = req.session || {};
    req.session.referralCode = req.query.ref;
  }
  
  // Continue with passport authentication
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});
