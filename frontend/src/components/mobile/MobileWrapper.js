import React, { useState, useEffect } from 'react';
import { useMobile } from '../../contexts/MobileContext';
import { useLocation } from 'react-router-dom';
import MobileHeader from './MobileHeader';
import MobileNavigation from './MobileNavigation';
import MobileSplashScreen from './MobileSplashScreen';
import MobileRoutes from '../../routes/mobileRoutes';
import { useAuth, AuthProvider } from '../../context/AuthContext';
import { NotificationProvider } from '../../context/NotificationContext';
import MobileLogoutHandler from './MobileLogoutHandler';
import './mobileStyles.css';

// Inner component that uses auth context
const MobileApp = ({ children }) => {
  const { isMobile } = useMobile();
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const location = useLocation();
  const auth = useAuth();
  
  // Mark app as ready after a short delay to avoid flickering if content loads quickly
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle route changes and apply mobile-specific styling
  useEffect(() => {
    // Only apply these effects if we're in mobile mode
    if (isMobile) {
      // Scroll to top on route change
      window.scrollTo(0, 0);
      
      // Apply a class to the body to prevent scrolling issues
      document.body.classList.add('mobile-view');
      
      // Force hide all footers with direct DOM manipulation
      const footers = document.querySelectorAll('footer, .footer');
      footers.forEach(footer => {
        footer.style.display = 'none';
        footer.style.visibility = 'hidden';
        footer.style.height = '0';
        footer.style.overflow = 'hidden';
      });
      
      // Preload YouTube API for better video handling
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      // Cleanup function
      return () => {
        document.body.classList.remove('mobile-view');
      };
    }
  }, [location.pathname, isMobile]);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <MobileSplashScreen onLoadComplete={handleSplashComplete} />}
      
      <div className={`mobile-app-wrapper ${showSplash ? 'invisible' : 'fade-in'}`}>
        <MobileHeader />
        
        <main className="mobile-app-content">
          {appReady ? <MobileRoutes /> : (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          )}
        </main>
        
        <MobileNavigation />
        
        {/* Add logout handler to monitor auth state */}
        <MobileLogoutHandler />
      </div>
    </>
  );
};

// Main wrapper component that ensures auth context is provided
const MobileWrapper = ({ children }) => {
  const { isMobile } = useMobile();
  
  // If not mobile, just render the children (desktop app)
  if (!isMobile) {
    return <>{children}</>;
  }

  // For mobile, wrap everything in AuthProvider AND NotificationProvider
  return (
    <AuthProvider>
      <NotificationProvider>
        <MobileApp>{children}</MobileApp>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default MobileWrapper;
