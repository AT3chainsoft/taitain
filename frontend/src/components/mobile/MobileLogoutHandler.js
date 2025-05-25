import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * This component handles automatic logout detection and provides a way
 * to gracefully redirect users when auth errors are encountered
 */
const MobileLogoutHandler = () => {
  const auth = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = auth;
  
  // Monitor auth state changes
  useEffect(() => {
    // Check for sudden loss of authentication on protected routes
    const isProtectedRoute = 
      location.pathname.startsWith('/dashboard') || 
      location.pathname === '/account' ||
      location.pathname === '/staking' ||
      location.pathname === '/deposit' ||
      location.pathname === '/withdraw';
    
    // If we were on a protected route and suddenly lost auth
    if (isProtectedRoute && !isAuthenticated && !user) {
      console.log('Auth state lost while on protected route', location.pathname);
      
      // First check if token still exists despite auth state change
      const token = localStorage.getItem('token');
      if (!token) {
        // Only show message if it seems like a genuine logout (token actually gone)
        toast.info('You have been signed out. Please login again.');
        
        // Redirect to login with return path
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: 'Your session has ended. Please sign in again.'
          } 
        });
      }
    }
  }, [isAuthenticated, user, navigate, location.pathname]);
  
  // This component doesn't render anything
  return null;
};

export default MobileLogoutHandler;
