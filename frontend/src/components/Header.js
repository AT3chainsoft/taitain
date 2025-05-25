import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  UserIcon, 
  ArrowDownTrayIcon, 
  ArrowPathIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Logo from './Logo';
import { 
  Bars3Icon, 
  XMarkIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import NotificationBadge from './NotificationBadge';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const mainNavItems = isAuthenticated ? [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Staking', href: '/staking', icon: CurrencyDollarIcon },
    { name: 'Deposit', href: '/deposit', icon: ArrowDownTrayIcon },
    { name: 'Withdraw', href: '/withdraw', icon: ArrowPathIcon },
    { name: 'Referrals', href: '/referral', icon: UserGroupIcon },
    { name: 'Community', href: '/forum', icon: ChatBubbleLeftRightIcon },
  ] : [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Features', href: '/#features', icon: CurrencyDollarIcon },
    { name: 'Packages', href: '/#packages', icon: ArrowDownTrayIcon },
    { name: 'FAQ', href: '/#faq', icon: UserGroupIcon },
    { name: 'Community', href: '/forum', icon: ChatBubbleLeftRightIcon },
  ];
  
  const handleLogout = () => {
    logout();
  };
  
  // Check if the current route is active
  const isActiveRoute = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };
  
  // Determine text color based on scroll state and path
  const isHomePage = location.pathname === '/';
  const textColorClass = scrolled || !isHomePage ? 'text-gray-800' : 'text-white';
  const activeTextColorClass = 'text-primary-600';
  const hoverTextColorClass = scrolled || !isHomePage ? 'hover:text-primary-600' : 'hover:text-primary-300';

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-500 ${
      scrolled 
        ? 'bg-white shadow-md backdrop-blur-sm py-2' 
        : isHomePage 
        ? 'bg-transparent py-4' 
        : 'bg-white shadow-sm py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="block">
              <Logo 
                size="sm" 
                withText 
                textColor={scrolled || !isHomePage ? 'default' : 'white'} 
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActiveRoute(item.href)
                    ? activeTextColorClass
                    : `${textColorClass} ${hoverTextColorClass}`
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NotificationBadge />
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className={`text-sm font-medium ${textColorClass} ${hoverTextColorClass}`}
                  >
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className={`flex items-center text-sm font-medium ${textColorClass} ${hoverTextColorClass} focus:outline-none`}>
                    <span className="mr-1">Account</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="py-2 border-b border-gray-100">
                      <div className="px-4 py-3">
                        <p className="text-sm leading-5 text-gray-900 truncate">
                          {user?.email || 'User'}
                        </p>
                        <p className="text-xs leading-4 text-gray-500 truncate">
                          Balance: ${user?.balance?.toFixed(2) || '0.00'} USDT
                        </p>
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors"
                      >
                        Profile Settings
                      </Link>
                      <Link
                        to="/withdraw"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors"
                      >
                        Withdrawals
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium ${textColorClass} ${hoverTextColorClass} px-4 py-2 border border-transparent hover:border-gray-200 rounded-md transition-all duration-300`}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-md shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${textColorClass}`}
              aria-expanded="false"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="pt-2 pb-4 space-y-1 px-4 max-h-screen overflow-y-auto">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActiveRoute(item.href)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <div className="pt-3 border-t border-gray-100">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.email || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Balance: ${user?.balance?.toFixed(2) || '0.00'} USDT
                    </p>
                  </div>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  <UserIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                  Profile Settings
                </Link>

                <Link
                  to="/withdraw"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  <ArrowPathIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                  Withdrawals
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                  >
                    <ChartBarIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-4 pb-2 border-t border-gray-200 flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="w-full px-4 py-2 text-center text-base font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="w-full px-4 py-2 text-center text-base font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-md hover:from-primary-700 hover:to-primary-800"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
