import React from 'react';
import { useMobile } from '../../contexts/MobileContext';
import MobileDepositPage from './MobileDepositPage';

const MobileDepositDetector = ({ children, onSubmit, loading }) => {
  const { isMobile } = useMobile();
  
  if (isMobile) {
    return <MobileDepositPage onSubmit={onSubmit} loading={loading} />;
  }
  
  // If not mobile, render the original deposit page
  return children;
};

export default MobileDepositDetector;
