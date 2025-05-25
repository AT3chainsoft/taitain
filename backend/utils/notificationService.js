const Notification = require('../models/Notification');

/**
 * Service to handle notification creation and management
 */
class NotificationService {
  /**
   * Create a user notification
   * @param {string} userId - The recipient user ID
   * @param {string} type - The notification type
   * @param {string} title - The notification title
   * @param {string} message - The notification message
   * @param {string} relatedId - Optional related document ID
   * @param {string} relatedModel - Optional related document model name
   */
  static async notifyUser(userId, type, title, message, relatedId = null, relatedModel = null) {
    try {
      // Always set link to the notifications page
      const link = '/notifications';
      
      // Create notification with corrected parameters
      await Notification.create({
        recipient: userId,
        type,
        title,
        message,
        link,
        isAdmin: false,
        relatedId,  // This should be the MongoDB ObjectId, not a URL
        relatedModel // This should be a string like 'Deposit', not the actual ID
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  }

  /**
   * Create an admin notification
   * @param {string} type - The notification type
   * @param {string} title - The notification title
   * @param {string} message - The notification message
   * @param {string} relatedId - Optional related document ID
   * @param {string} relatedModel - Optional related document model name
   */
  static async notifyAdmins(type, title, message, relatedId = null, relatedModel = null) {
    try {
      // Always set link to the notifications page
      const link = '/notifications';
      
      // Find all admin users
      const User = require('../models/User');
      const adminUsers = await User.find({ role: 'admin' }).select('_id');
      
      // Create a notification for each admin
      const notifications = adminUsers.map(admin => ({
        recipient: admin._id,
        type,
        title,
        message,
        link,
        isAdmin: true,
        relatedId,  // This should be the MongoDB ObjectId, not a URL
        relatedModel // This should be a string like 'Deposit', not the actual ID
      }));
      
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (error) {
      console.error('Failed to create admin notifications:', error);
    }
  }

  /**
   * Create both user and admin notifications for a significant event
   */
  static async notifyUserAndAdmins(userId, type, userTitle, userMessage, adminTitle, adminMessage, relatedId = null, relatedModel = null) {
    await this.notifyUser(userId, type, userTitle, userMessage, relatedId, relatedModel);
    await this.notifyAdmins(type, adminTitle, adminMessage, relatedId, relatedModel);
  }
}

module.exports = NotificationService;
