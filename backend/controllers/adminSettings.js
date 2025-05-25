const asyncHandler = require('express-async-handler');
const AdminSetting = require('../models/AdminSetting');

// @desc    Get all admin settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSettings = asyncHandler(async (req, res, next) => {
  try {
    const settings = await AdminSetting.find();
    
    res.status(200).json({
      success: true,
      count: settings.length,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get a single setting by key
// @route   GET /api/admin/settings/:key
// @access  Private/Admin
exports.getSetting = asyncHandler(async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Update or create an admin setting
// @route   PUT /api/admin/settings/:key
// @access  Private/Admin
exports.updateSetting = asyncHandler(async (req, res, next) => {
  try {
    const { value, description } = req.body;
    
    // Find and update, or create if doesn't exist
    let setting = await AdminSetting.findOne({ key: req.params.key });
    
    if (setting) {
      setting.value = value;
      if (description) setting.description = description;
      setting.updatedBy = req.user.id;
    } else {
      setting = new AdminSetting({
        key: req.params.key,
        value,
        description,
        updatedBy: req.user.id
      });
    }
    
    await setting.save();
    
    res.status(200).json({
      success: true,
      data: setting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Delete an admin setting
// @route   DELETE /api/admin/settings/:key
// @access  Private/Admin
exports.deleteSetting = asyncHandler(async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Get public wallet addresses
// @route   GET /api/settings/wallet-addresses
// @access  Public
exports.getPublicWalletAddresses = asyncHandler(async (req, res) => {
  try {
    const settings = await AdminSetting.find({
      key: /^wallet_/
    });
    
    const walletAddresses = {};
    settings.forEach(setting => {
      const network = setting.key.replace('wallet_', '');
      walletAddresses[network] = setting.value;
    });
    
    res.status(200).json({
      success: true,
      data: walletAddresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});
