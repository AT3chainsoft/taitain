import React from 'react';
import { useMobile } from '../../contexts/MobileContext';
import MobileAccountPage from './MobileAccountPage';

const MobileAccountDetector = ({ children }) => {
  const { isMobile } = useMobile();
  
  if (isMobile) {
    return <MobileAccountPage />;
  }
  
  return children;
};

export default MobileAccountDetector;
