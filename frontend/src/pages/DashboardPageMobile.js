import React from 'react';
import DashboardPage from './DashboardPage';
import MobileDashboardDetector from '../components/mobile/MobileDashboardDetector';

// This is a wrapper that will decide whether to show the mobile or desktop dashboard
const DashboardPageMobile = () => {
  return (
    <DashboardPage>
      {(stats, recentActivity) => (
        <MobileDashboardDetector 
          stats={stats} 
          recentActivity={recentActivity}
        >
          {/* Original dashboard content will go here */}
          {/* The detector will handle passing this through if not mobile */}
        </MobileDashboardDetector>
      )}
    </DashboardPage>
  );
};

export default DashboardPageMobile;
