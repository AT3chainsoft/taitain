import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BellIcon, 
  TrashIcon, 
  CheckIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../context/NotificationContext';
import { toast } from 'react-toastify';

const MobileNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get notifications safely with fallbacks
  const notificationContext = useNotifications();
  
  // Use effect to load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      
      try {
        // If the context is available, use it
        if (notificationContext && typeof notificationContext.fetchNotifications === 'function') {
          await notificationContext.fetchNotifications();
          // If we have notifications in context, use them
          if (notificationContext.notifications) {
            setNotifications(notificationContext.notifications);
          }
        } else {
          // Fallback: if context isn't working, try direct API call
          setError('Notification system is not available.');
        }
      } catch (err) {
        console.error('Error loading notifications:', err);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    
    loadNotifications();
    
    // Highlight specific notification if needed
    const highlightedId = location.state?.highlightedId;
    if (highlightedId) {
      setTimeout(() => {
        const element = document.getElementById(`notification-${highlightedId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return notification.type === filter;
  });

  const handleDeleteAllRead = () => {
    if (!notificationContext || !notificationContext.deleteAllRead) {
      toast.error("Notification functions are not available");
      return;
    }
    
    if (window.confirm('Are you sure you want to delete all read notifications?')) {
      notificationContext.deleteAllRead();
      toast.success('All read notifications deleted');
    }
  };

  const handleMarkAllAsRead = () => {
    if (!notificationContext || !notificationContext.markAllAsRead) {
      toast.error("Notification functions are not available");
      return;
    }
    
    notificationContext.markAllAsRead();
    toast.success('All notifications marked as read');
  };

  const handleMarkAsReadAndNavigate = (notification) => {
    if (!notification.read && notificationContext && notificationContext.markAsRead) {
      notificationContext.markAsRead(notification._id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
    
    if (notification.relatedId && notification.relatedModel) {
      // Navigate to the related entity
      const path = getPathForRelatedEntity(notification.relatedModel, notification.relatedId);
      if (path) {
        navigate(path);
      }
    }
  };
  
  const handleDeleteNotification = (id, event) => {
    if (event) event.stopPropagation();
    
    if (!notificationContext || !notificationContext.deleteNotification) {
      toast.error("Notification functions are not available");
      return;
    }
    
    notificationContext.deleteNotification(id);
    toast.info('Notification deleted');
  };
  
  const getPathForRelatedEntity = (model, id) => {
    switch (model.toLowerCase()) {
      case 'staking':
        return `/staking/${id}`;
      case 'deposit':
        return `/deposit/${id}`;
      case 'withdrawal':
        return `/withdraw/${id}`;
      case 'ticket':
        return `/support/${id}`;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <BellIcon className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading notifications</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="bg-white shadow-sm mb-4">
        <div className="p-3 flex items-center justify-between border-b border-gray-100">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Notifications</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              {!loading && (
                <>
                  {notifications.filter(n => !n.read).length} unread • 
                  {notifications.length} total
                </>
              )}
            </p>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setFiltersOpen(true)}
              className="p-2 rounded-full hover:bg-gray-50"
              title="Filter"
            >
              <FunnelIcon className="h-5 w-5 text-gray-400" />
            </button>
            <button
              onClick={handleMarkAllAsRead}
              className="p-2 rounded-full hover:bg-gray-50"
              title="Mark all as read"
            >
              <CheckIcon className="h-5 w-5 text-gray-400" />
            </button>
            <button
              onClick={handleDeleteAllRead}
              className="p-2 rounded-full hover:bg-gray-50"
              title="Delete all read"
            >
              <TrashIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <div className="bg-white shadow-sm rounded-lg mb-4">
          <div className="p-3 border-b border-gray-100 flex justify-between">
            <h3 className="text-sm font-medium">Filter Notifications</h3>
            <button 
              onClick={() => setFiltersOpen(false)}
              className="text-gray-400"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setFilter('all'); setFiltersOpen(false); }}
                className={`px-3 py-1 text-xs rounded-full ${
                  filter === 'all' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => { setFilter('unread'); setFiltersOpen(false); }}
                className={`px-3 py-1 text-xs rounded-full ${
                  filter === 'unread' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => { setFilter('deposit'); setFiltersOpen(false); }}
                className={`px-3 py-1 text-xs rounded-full ${
                  filter === 'deposit' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => { setFilter('withdrawal'); setFiltersOpen(false); }}
                className={`px-3 py-1 text-xs rounded-full ${
                  filter === 'withdrawal' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Withdrawals
              </button>
              <button
                onClick={() => { setFilter('staking'); setFiltersOpen(false); }}
                className={`px-3 py-1 text-xs rounded-full ${
                  filter === 'staking' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Staking
              </button>
              <button
                onClick={() => { setFilter('security'); setFiltersOpen(false); }}
                className={`px-3 py-1 text-xs rounded-full ${
                  filter === 'security' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Security
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="divide-y divide-gray-100 bg-white shadow-sm">
          {filteredNotifications.map(notification => (
            <div 
              key={notification._id}
              id={`notification-${notification._id}`}
              className={`p-3 ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => handleMarkAsReadAndNavigate(notification)}
            >
              <div className="flex">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                    <span role="img" aria-label={notification.type}>
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-start">
                    <p className={`text-sm font-medium ${notification.read ? 'text-gray-900' : 'text-primary-600'} pr-2`}>
                      {notification.title}
                    </p>
                    <div className="flex space-x-1">
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary-600"></div>
                      )}
                      <button
                        onClick={(e) => handleDeleteNotification(notification._id, e)}
                        className="p-1"
                      >
                        <TrashIcon className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="mt-1.5 flex items-center text-xs text-gray-500">
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {notification.type}
                    </span>
                    <span className="mx-1.5">•</span>
                    <span>{formatDateTime(notification.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white shadow-sm rounded-lg">
          <BellIcon className="mx-auto h-10 w-10 text-gray-400" />
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

export default MobileNotificationsPage;
