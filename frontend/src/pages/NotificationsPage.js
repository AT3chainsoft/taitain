import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  BellIcon, 
  TrashIcon, 
  EyeIcon,
  CheckIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../context/NotificationContext';

const NotificationsPage = () => {
  const { 
    notifications, 
    loading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    deleteAllRead 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const location = useLocation();
  const highlightedNotificationRef = useRef(null);
  
  useEffect(() => {
    // Refresh notifications when page loads
    fetchNotifications();
    
    // Check if we need to highlight a specific notification
    const highlightedId = location.state?.highlightedId;
    if (highlightedId) {
      // Use setTimeout to allow the page to render first
      setTimeout(() => {
        const element = document.getElementById(`notification-${highlightedId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add a temporary highlight effect
          element.classList.add('bg-yellow-50');
          setTimeout(() => {
            element.classList.remove('bg-yellow-50');
            element.classList.add('bg-white', 'transition-colors', 'duration-1000');
          }, 2000);
        }
      }, 500);
    }
  }, [location.state]);

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

  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return notification.type === filter;
  });

  const handleDeleteAllRead = () => {
    if (window.confirm('Are you sure you want to delete all read notifications?')) {
      deleteAllRead();
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all your notifications
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
            Filter
          </button>
          <button
            onClick={handleMarkAllAsRead}
            className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <CheckIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
            Mark all as read
          </button>
          <button
            onClick={handleDeleteAllRead}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <TrashIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Delete read
          </button>
        </div>
      </div>

      {filtersOpen && (
        <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Filter Notifications</h3>
              <button 
                onClick={() => setFiltersOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'unread' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'read' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Read
              </button>
              <button
                onClick={() => setFilter('deposit')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'deposit' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => setFilter('withdrawal')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'withdrawal' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Withdrawals
              </button>
              <button
                onClick={() => setFilter('staking')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'staking' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Staking
              </button>
              <button
                onClick={() => setFilter('security')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'security' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setFilter('referral')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'referral' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Referrals
              </button>
              <button
                onClick={() => setFilter('system')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'system' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                System
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredNotifications.map(notification => (
              <li 
                key={notification._id}
                id={`notification-${notification._id}`}
                className={`${!notification.read ? 'bg-blue-50' : ''} transition-colors duration-300`}
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                        <span role="img" aria-label={notification.type}>
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          {notification.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {notification.type}
                          </p>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex justify-between">
                        <p className="text-xs text-gray-500">
                          {formatDateTime(notification.createdAt)}
                        </p>
                        <div className="flex space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="text-primary-600 hover:text-primary-800"
                              title="Mark as read"
                            >
                              <EyeIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete notification"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {notification.link && (
                    <div className="mt-2 ml-14">
                     
                    </div>
                  )}
                  {notification.relatedId && notification.relatedModel && (
                    <div className="mt-2 ml-14">
                     
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12">
          <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter !== 'all' 
              ? 'No notifications match your current filter.' 
              : 'You have no notifications at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
