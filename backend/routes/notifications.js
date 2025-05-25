const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteReadNotifications
} = require('../controllers/notifications');

// All routes require authentication
router.use(protect);

// User routes
router.route('/')
  .get(getNotifications);

// Admin routes
router.route('/')
  .post(authorize('admin'), createNotification);

router.route('/:id/read')
  .put(markNotificationAsRead);

router.route('/read-all')
  .put(markAllNotificationsAsRead);

router.route('/:id')
  .delete(deleteNotification);

router.route('/read')
  .delete(deleteReadNotifications);

module.exports = router;
