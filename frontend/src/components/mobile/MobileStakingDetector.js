import React from 'react';
import { useMobile } from '../../contexts/MobileContext';
import MobileStakingPage from './MobileStakingPage';

const MobileStakingDetector = ({ children, packages, onSelect }) => {
  const { isMobile } = useMobile();
  
  if (isMobile) {
    return <MobileStakingPage packages={packages} onSelect={onSelect} />;
  }
  
  // If not mobile, render the original staking page
  return children;
};

export default MobileStakingDetector;
