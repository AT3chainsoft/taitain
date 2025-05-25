import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  BellIcon,
  ArrowLeftIcon,
  UserCircleIcon,
  Bars3Icon,
  ChevronDownIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const MobileHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth() || { isAuthenticated: false, user: null };
  const { isAuthenticated, user } = auth;
  const notificationContext = useNotifications();
  const unreadCount = notificationContext?.unreadCount || 0;
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position to add shadow to header when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Pages that need a back button
  const needsBackButton = !['/dashboard', '/account', '/staking', '/deposit', '/withdraw', '/support'].includes(location.pathname);
  
  // Special transparent header for home page
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  
  // Format balance for display
  const formatBalance = (balance) => {
    if (balance === undefined || balance === null) return '$0.00';
    return `$${parseFloat(balance).toFixed(2)}`;
  };

  // Get the current page title based on location
  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/account') return 'Account';
    if (location.pathname === '/staking') return 'Staking';
    if (location.pathname === '/deposit') return 'Deposit';
    if (location.pathname === '/withdraw') return 'Withdraw';
    if (location.pathname === '/support') return 'Support';
    if (location.pathname.includes('/notifications')) return 'Notifications';
    if (location.pathname === '/login') return 'Sign In';
    if (location.pathname === '/register') return 'Create Account';
    return 'Taitan Staking';
  };

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <header 
        className={`mobile-header ${scrolled ? 'shadow-md' : ''} 
          bg-gradient-to-r from-primary-800 to-primary-600`}
      >
        <div className="mobile-header-content">
          {isHomePage ? (
            // Home page special header
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-9 w-9 mr-2 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold shadow-lg">
                <span className="text-lg font-bold">T</span>
              </div>
              <span className="text-white font-semibold text-xl tracking-wide">Taitan</span>
            </motion.div>
          ) : needsBackButton ? (
            <button 
              onClick={handleBack}
              className="mobile-header-button text-white hover:bg-white/10 active:bg-white/20 rounded-full p-1.5 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex items-center">
              <div className="h-7 w-7 mr-2 rounded-md bg-white/20 flex items-center justify-center text-white font-bold shadow-sm">
                T
              </div>
              <span className="text-white font-medium">Taitan</span>
            </div>
          )}
          
          {/* Remove the page title display - as requested */}
          
          {isHomePage ? (
            // Home page actions
            <Link 
              to="/login" 
              className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-lg border border-white/30 shadow-sm hover:bg-white/30 active:bg-white/40 transition-colors"
            >
              Sign In
            </Link>
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-3">
              {/* User balance display with subtle glow effect */}
              <div className="bg-white/10 rounded-lg px-2.5 py-1 shadow-inner">
                <div className="text-white text-sm font-medium">
                  {formatBalance(user?.balance)}
                </div>
              </div>
              
              {/* Notifications icon with badge and animation */}
              <Link 
                to="/notifications" 
                className="mobile-header-button text-white relative hover:bg-white/10 active:bg-white/20 rounded-full p-1.5 transition-colors"
                aria-label="Notifications"
              >
                {unreadCount > 0 ? (
                  <BellSolidIcon className="h-5 w-5" />
                ) : (
                  <BellIcon className="h-5 w-5" />
                )}
                {unreadCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center shadow-sm"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </Link>
              
              {/* User profile button - only showing on certain pages */}
              {location.pathname !== '/account' && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="mobile-header-button text-white hover:bg-white/10 active:bg-white/20 rounded-full p-1.5 transition-colors flex items-center"
                    aria-label="User menu"
                  >
                    <UserCircleIcon className="h-5 w-5" />
                  </button>
                  
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
                      >
                        <div className="py-1">
                          <Link 
                            to="/account" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowDropdown(false)}
                          >
                            Your Account
                          </Link>
                          <Link 
                            to="/settings" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowDropdown(false)}
                          >
                            Settings
                          </Link>
                          <button 
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => {
                              if (auth.logout) auth.logout();
                              setShowDropdown(false);
                            }}
                          >
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {!isLoginPage && (
                <Link 
                  to="/login" 
                  className="px-3 py-1 bg-white/10 text-white text-xs rounded-md hover:bg-white/20"
                >
                  Sign In
                </Link>
              )}
              {!isRegisterPage && (
                <Link 
                  to="/register" 
                  className="px-3 py-1 bg-white/20 text-white text-xs rounded-md border border-white/30 hover:bg-white/30"
                >
                  Register
                </Link>
              )}
            </div>
          )}
        </div>
        
        {/* Add subtle bottom divider with gradient */}
        <div className="h-0.5 bg-gradient-to-r from-white/5 via-white/10 to-white/5"></div>
      </header>
      
      {/* Background overlay for dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-10" 
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </>
  );
};

export default MobileHeader;
