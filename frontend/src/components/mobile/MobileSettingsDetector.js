import React from 'react';
import { useMobile } from '../../contexts/MobileContext';
import MobileSettingsPage from './MobileSettingsPage';

const MobileSettingsDetector = ({ children }) => {
  const { isMobile } = useMobile();
  
  if (isMobile) {
    return <MobileSettingsPage />;
  }
  
  return children;
};

export default MobileSettingsDetector;
