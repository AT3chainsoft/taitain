const express = require('express');
const { 
  getSettings, 
  getSetting, 
  updateSetting, 
  deleteSetting 
} = require('../controllers/adminSettings');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin privileges
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getSettings);

router.route('/:key')
  .get(getSetting)
  .put(updateSetting)
  .delete(deleteSetting);

module.exports = router;
