const asyncHandler = require('express-async-handler');
const AdminSetting = require('../models/AdminSetting');

// @desc    Get all settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSettings = asyncHandler(async (req, res) => {
  const settings = await AdminSetting.find();
  
  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Get a specific setting by key
// @route   GET /api/admin/settings/:key
// @access  Private/Admin
exports.getSetting = asyncHandler(async (req, res) => {
  const setting = await AdminSetting.findOne({ key: req.params.key });
  
  if (!setting) {
    return res.status(404).json({
      success: false,
      error: 'Setting not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: setting
  });
});

// @desc    Update a setting
// @route   PUT /api/admin/settings/:key
// @access  Private/Admin
exports.updateSetting = asyncHandler(async (req, res) => {
  // Find setting by key or create if it doesn't exist
  let setting = await AdminSetting.findOne({ key: req.params.key });
  
  const { value, description } = req.body;
  
  if (!setting) {
    // Create new setting
    setting = await AdminSetting.create({
      key: req.params.key,
      value,
      description,
      updatedBy: req.user.id
    });
  } else {
    // Update existing setting
    setting.value = value;
    if (description) setting.description = description;
    setting.updatedBy = req.user.id;
    setting.updatedAt = Date.now();
    
    await setting.save();
  }
  
  res.status(200).json({
    success: true,
    data: setting
  });
});

// @desc    Delete a setting
// @route   DELETE /api/admin/settings/:key
// @access  Private/Admin
exports.deleteSetting = asyncHandler(async (req, res) => {
  const setting = await AdminSetting.findOne({ key: req.params.key });
  
  if (!setting) {
    return res.status(404).json({
      success: false,
      error: 'Setting not found'
    });
  }
  
  await setting.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get public wallet addresses
// @route   GET /api/settings/wallet-addresses
// @access  Public
exports.getPublicWalletAddresses = asyncHandler(async (req, res) => {
  // Retrieve all wallet address settings
  const walletSettings = await AdminSetting.find({
    key: { $in: ['usdt_trc20', 'usdt_polygon', 'usdc_trc20', 'usdc_polygon'] }
  });
  
  // Convert to an object
  const walletAddresses = {};
  walletSettings.forEach(setting => {
    walletAddresses[setting.key] = setting.value;
  });
  
  res.status(200).json({
    success: true,
    data: walletAddresses
  });
});
