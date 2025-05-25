import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  HomeIcon, 
  CurrencyDollarIcon, 
  UserCircleIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  UserGroupIcon,
  InformationCircleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolidIcon, 
  CurrencyDollarIcon as CurrencyDollarSolidIcon,
  UserCircleIcon as UserCircleSolidIcon,
  ArrowUpCircleIcon as ArrowUpCircleSolidIcon,
  ArrowDownCircleIcon as ArrowDownCircleSolidIcon,
  UserGroupIcon as UserGroupSolidIcon,
  InformationCircleIcon as InformationCircleSolidIcon,
  LockClosedIcon as LockClosedSolidIcon
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const MobileNavigation = () => {
  const location = useLocation();
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const { isAuthenticated } = useAuth() || { isAuthenticated: false };
  
  // Routes configuration for authenticated users
  const authRoutes = [
    { path: '/dashboard', label: 'Home', icon: HomeIcon, activeIcon: HomeSolidIcon },
    { path: '/deposit', label: 'Deposit', icon: ArrowDownCircleIcon, activeIcon: ArrowDownCircleSolidIcon },
    { path: '/staking', label: 'Stake', icon: CurrencyDollarIcon, activeIcon: CurrencyDollarSolidIcon, primary: true },
    { path: '/withdraw', label: 'Withdraw', icon: ArrowUpCircleIcon, activeIcon: ArrowUpCircleSolidIcon },
    { path: '/account', label: 'Account', icon: UserCircleIcon, activeIcon: UserCircleSolidIcon },
  ];
  
  // Routes configuration for public users
  const publicRoutes = [
    { path: '/', label: 'Home', icon: HomeIcon, activeIcon: HomeSolidIcon },
    { path: '/features', label: 'Features', icon: InformationCircleIcon, activeIcon: InformationCircleSolidIcon },
    { path: '/register', label: 'Register', icon: UserGroupIcon, activeIcon: UserGroupSolidIcon, primary: true },
    { path: '/login', label: 'Sign In', icon: LockClosedIcon, activeIcon: LockClosedSolidIcon },
    { path: '/about', label: 'About', icon: UserCircleIcon, activeIcon: UserCircleSolidIcon },
  ];
  
  // Choose the appropriate routes based on authentication status
  const routes = isAuthenticated ? authRoutes : publicRoutes;
  
  // Determine if a route is active - handle base path matching
  const isRouteActive = (route) => {
    const currentPath = location.pathname;
    if (route === '/' && currentPath === '/') return true;
    if (route === '/dashboard' && currentPath === '/dashboard') return true;
    if (route !== '/' && route !== '/dashboard' && currentPath.startsWith(route)) return true;
    return false;
  };
  
  // Hide navigation on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10 || Math.abs(prevScrollPos - currentScrollPos) < 10;
      setPrevScrollPos(currentScrollPos);
      setVisible(isVisible);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg"
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced navigation with prominent center button */}
      <div className="relative grid grid-cols-5 h-16">
        {routes.map((route, index) => {
          const isActive = isRouteActive(route.path);
          const Icon = isActive ? route.activeIcon : route.icon;
          
          // Special styling for primary (center) button
          if (route.primary) {
            return (
              <Link
                key={route.path}
                to={route.path}
                className="relative flex flex-col items-center justify-center text-xs font-medium z-10"
              >
                <motion.div
                  className="absolute -top-6 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full p-3.5 shadow-lg border-4 border-white"
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Icon className={`h-7 w-7 ${isActive ? 'text-white' : 'text-white/90'}`} />
                </motion.div>
                <span className={`mt-7 font-semibold ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                  {route.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    className="absolute bottom-0 w-10 h-0.5 bg-primary-600 rounded-t"
                    layoutId="activeTabPrimary"
                    transition={{ duration: 0.3, type: 'spring' }}
                  />
                )}
              </Link>
            );
          }
          
          // Regular nav items
          return (
            <Link
              key={route.path}
              to={route.path}
              className={`flex flex-col items-center justify-center text-xs font-medium ${
                isActive 
                  ? 'text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="h-6 w-6 mb-1" />
              </motion.div>
              <span>{route.label}</span>
              {isActive && (
                <motion.div 
                  className="absolute bottom-0 w-6 h-0.5 bg-primary-600 rounded-t"
                  layoutId="activeTab"
                  transition={{ duration: 0.3, type: 'spring' }}
                />
              )}
            </Link>
          );
        })}
        
        {/* Add subtle gradient background under the navigation */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-100 via-primary-300 to-primary-100 opacity-50"></div>
      </div>
    </motion.nav>
  );
};

export default MobileNavigation;
