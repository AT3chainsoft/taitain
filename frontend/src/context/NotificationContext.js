import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from '../utils/axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [pollingInterval, setPollingInterval] = useState(null);
  const notificationSound = useRef(null);
  const previousUnreadCount = useRef(0);

  // Initialize sound on component mount
  useEffect(() => {
    // Create audio element for notification sound
    notificationSound.current = new Audio('/sounds/notification.mp3');
    notificationSound.current.preload = 'auto';
    
    // Try to load the sound file
    notificationSound.current.load();
    
    return () => {
      // Clean up audio resources
      if (notificationSound.current) {
        notificationSound.current.pause();
        notificationSound.current = null;
      }
    };
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await axios.get('/api/notifications?limit=20');
      
      // Check if there are new notifications to play sound
      const newUnreadCount = response.data.unreadCount;
      if (previousUnreadCount.current !== 0 && // Skip on first load
          newUnreadCount > previousUnreadCount.current) {
        playNotificationSound();
      }
      previousUnreadCount.current = newUnreadCount;
      
      setNotifications(response.data.data);
      setUnreadCount(newUnreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to manually play notification sound
  const playNotificationSound = () => {
    try {
      if (notificationSound.current) {
        // Reset the audio to the beginning
        notificationSound.current.currentTime = 0;
        
        // Set volume to a reasonable level
        notificationSound.current.volume = 0.7;
        
        // Play the sound with a user interaction safety net
        const playPromise = notificationSound.current.play();
        
        // Handle case where play() returns a promise (modern browsers)
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn('Browser prevented sound playback:', error);
            // We'll try again next time with user interaction
          });
        }
      }
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(
        notifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      
      // Update local state
      setNotifications(
        notifications.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      
      // Update local state
      const updatedNotifications = notifications.filter(
        notification => notification._id !== notificationId
      );
      setNotifications(updatedNotifications);
      
      // Update unread count if the deleted notification was unread
      const wasUnread = notifications.find(
        notification => notification._id === notificationId && !notification.read
      );
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Delete all read notifications
  const deleteAllRead = async () => {
    try {
      await axios.delete('/api/notifications/read');
      
      // Update local state
      const unreadNotifications = notifications.filter(notification => !notification.read);
      setNotifications(unreadNotifications);
    } catch (error) {
      console.error('Failed to delete read notifications:', error);
    }
  };

  // Set up polling for notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !pollingInterval) {
      fetchNotifications();
      
      // Poll for new notifications every 60 seconds
      const interval = setInterval(fetchNotifications, 60000);
      setPollingInterval(interval);
    } else if (!isAuthenticated && pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
      setNotifications([]);
      setUnreadCount(0);
      previousUnreadCount.current = 0;
    }
    
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [isAuthenticated, user?.id]);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    playNotificationSound
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
