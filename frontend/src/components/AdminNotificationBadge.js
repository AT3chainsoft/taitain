import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { useNotifications } from '../context/NotificationContext';

const AdminNotificationBadge = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, playNotificationSound } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Filter for admin notifications only
  const adminNotifications = notifications.filter(notification => notification.isAdmin);
  const adminUnreadCount = adminNotifications.filter(notification => !notification.read).length;

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'deposit':
        return '💰';
      case 'withdrawal':
        return '💸';
      case 'staking':
        return '📈';
      case 'reward':
        return '🏆';
      case 'security':
        return '🛡️';
      case 'system':
        return '⚙️';
      case 'referral':
        return '👥';
      case 'support':
        return '🔧';
      default:
        return '📣';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000); // difference in seconds
    
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} d ago`;
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    setDropdownOpen(false);
    
    // Navigate based on notification type for admin
    if (notification.type === 'deposit') {
      navigate('/admin/deposits');
    } else if (notification.type === 'withdrawal') {
      navigate('/admin/withdrawals');
    } else if (notification.type === 'support') {
      navigate('/admin/tickets');
    } else if (notification.type === 'staking') {
      navigate('/admin/stakings');
    } else {
      navigate('/admin/notifications', { state: { highlightedId: notification._id } });
    }
  };

  const handleMarkAllAsRead = (e) => {
    e.preventDefault();
    e.stopPropagation();
    markAllAsRead();
  };

  // Function to handle bell click - this enables audio to play on user interaction
  const handleBellClick = () => {
    // If there are unread notifications, play the sound when user clicks
    if (adminUnreadCount > 0) {
      playNotificationSound();
    }
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="relative p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      >
        <span className="sr-only">View notifications</span>
        {adminUnreadCount > 0 ? (
          <BellSolidIcon className="h-6 w-6" aria-hidden="true" />
        ) : (
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        )}
        
        {adminUnreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs font-bold text-white animate-pulse">
            {adminUnreadCount > 9 ? '9+' : adminUnreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Admin Notifications</h3>
            {adminUnreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {adminNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {adminNotifications.map(notification => (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left block px-4 py-3 hover:bg-gray-50 transition duration-150 ease-in-out ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 text-center">
                        <span role="img" aria-label={notification.type}>
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0 ml-2">
                          <span className="inline-flex h-2 w-2 rounded-full bg-red-600"></span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500 text-sm">No admin notifications</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 p-2 text-center">
            <Link
              to="/admin/notifications"
              onClick={() => setDropdownOpen(false)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View all admin notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationBadge;
