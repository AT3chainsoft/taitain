import React from 'react';
import { useMobile } from '../../contexts/MobileContext';
import MobileHomePage from './MobileHomePage';

const MobileHomeDetector = ({ children }) => {
  const { isMobile } = useMobile();
  
  if (isMobile) {
    return <MobileHomePage />;
  }
  
  // If not mobile, render the original home page
  return children;
};

export default MobileHomeDetector;
