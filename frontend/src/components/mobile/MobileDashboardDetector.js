import React from 'react';
import { useMobile } from '../../contexts/MobileContext';
import MobileDashboard from './MobileDashboard';

// This component detects if we should show the mobile dashboard
const MobileDashboardDetector = ({ children, stats, recentActivity }) => {
  const { isMobile } = useMobile();
  
  if (isMobile) {
    return <MobileDashboard stats={stats} recentActivity={recentActivity} />;
  }
  
  // If not mobile, render the original dashboard
  return children;
};

export default MobileDashboardDetector;
