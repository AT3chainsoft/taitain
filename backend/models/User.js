const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    // Update the regex to accept our wallet-generated emails
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    sparse: true // Allows null values for users who authenticate via wallet only
  },
  password: {
    type: String,
    minlength: 6,
    select: false,
    // Required only if no wallet address is provided
    required: function() {
      return !this.walletAddress;
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  googleId: {
    type: String,
  },
  walletAddress: {
    type: String,
    sparse: true, // This allows multiple null/empty values but enforces uniqueness for non-empty values
    unique: true,  // Each wallet address must be unique
    trim: true,     // Remove whitespace
    lowercase: true // Convert to lowercase
  },
  withdrawalWalletAddress: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^T[A-Za-z0-9]{33}$/.test(v);
      },
      message: props => `${props.value} is not a valid TRC20 address!`
    }
  },
  nonce: {
    type: String,
    default: () => crypto.randomBytes(16).toString('hex')
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  },
  balance: {
    type: Number,
    default: 0
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referralEarnings: {
    type: Number,
    default: 0
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for referrals
UserSchema.virtual('referrals', {
  ref: 'User',
  localField: '_id',
  foreignField: 'referrer',
  justOne: false
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  // If referralCode doesn't exist, create one
  if (!this.referralCode) {
    this.referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
  }
  
  // Only hash the password if it's modified
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hash password
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    console.error('Error hashing password:', err);
    next(err);
  }
});

// Ensure password is hashed before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Add index for referrer
UserSchema.index({ referrer: 1 });

module.exports = mongoose.model('User', UserSchema);
