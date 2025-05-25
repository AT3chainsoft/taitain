import React, { createContext, useContext, useState, useEffect } from 'react';
import { isMobileDevice, isMobileScreenSize } from '../utils/mobileDetector';

const MobileContext = createContext(null);

export const useMobile = () => useContext(MobileContext);

export const MobileProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Set initial state
    const checkMobile = () => {
      setIsMobile(isMobileDevice() || isMobileScreenSize());
    };
    
    // Check on mount
    checkMobile();
    
    // Check on resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
};
