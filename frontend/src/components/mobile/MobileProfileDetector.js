import React from 'react';
import { useMobile } from '../../contexts/MobileContext';
import MobileProfilePage from './MobileProfilePage';

const MobileProfileDetector = ({ children }) => {
  const { isMobile } = useMobile();
  
  if (isMobile) {
    return <MobileProfilePage />;
  }
  
  // If not mobile, render the original profile page
  return children;
};

export default MobileProfileDetector;
