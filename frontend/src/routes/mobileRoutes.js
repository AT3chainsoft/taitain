import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// Auth components - use safe wrapper for RegisterPage
import LoginPage from '../pages/LoginPage';
import SafeRegisterPage from '../components/mobile/SafeRegisterPage';

// Mobile-specific components
import MobileDashboard from '../components/mobile/MobileDashboard';
import MobileAccountPage from '../components/mobile/MobileAccountPage';
import MobileHomePage from '../components/mobile/MobileHomePage';
import MobileAboutPage from '../components/mobile/MobileAboutPage'; // Import the new component
import MobileStakingPage from '../components/mobile/MobileStakingPage';
import MobileDepositPage from '../components/mobile/MobileDepositPage';
import MobileWithdrawPage from '../components/mobile/MobileWithdrawPage';
import MobileReferralPage from '../components/mobile/MobileReferralPage';
import MobileSupportPage from '../components/mobile/MobileSupportPage';
import MobileNewTicketPage from '../components/mobile/MobileNewTicketPage';
import MobileTicketDetailPage from '../components/mobile/MobileTicketDetailPage';
import MobileSettingsPage from '../components/mobile/MobileSettingsPage';
import MobileProfilePage from '../components/mobile/MobileProfilePage';
import MobileNotificationsPage from '../components/mobile/MobileNotificationsPage';

// Auth handling
import PrivateRoute from '../components/PrivateRoute';
import { useAuth } from '../context/AuthContext';

// Import shared staking packages
import { stakingPackages } from '../data/stakingPackages';

const MobileRoutes = () => {
  // Use auth without destructuring to ensure we detect any issues
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;

  console.log('Mobile routes rendering - Auth state:', isAuthenticated);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SafeRegisterPage />} /> {/* Use our safe wrapper */}
      <Route path="/" element={<MobileHomePage />} /> {/* Always show MobileHomePage, not redirecting */}
      <Route path="/features" element={<MobileHomePage />} /> {/* Placeholder for Features page */}
      <Route path="/about" element={<MobileAboutPage />} /> {/* Add the about page route */}
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <MobileDashboard />
        </PrivateRoute>
      } />
      
      <Route path="/account" element={
        <PrivateRoute>
          <MobileAccountPage />
        </PrivateRoute>
      } />
      
      <Route path="/staking" element={
        <PrivateRoute>
          {/* Use the identical packages from the shared data file */}
          <MobileStakingPage 
            packages={stakingPackages}
            onSelect={(packageInfo) => {
              console.log('Selected package:', packageInfo);
              // This would create a staking using the same API as desktop
            }}
          />
        </PrivateRoute>
      } />
      
      <Route path="/deposit" element={
        <PrivateRoute>
          <MobileDepositPage />
        </PrivateRoute>
      } />
      
      <Route path="/withdraw" element={
        <PrivateRoute>
          <MobileWithdrawPage />
        </PrivateRoute>
      } />
      
      <Route path="/referral" element={
        <PrivateRoute>
          <MobileReferralPage />
        </PrivateRoute>
      } />
      
      <Route path="/notifications" element={
        <PrivateRoute>
          <MobileNotificationsPage />
        </PrivateRoute>
      } />
      
      <Route path="/settings" element={
        <PrivateRoute>
          <MobileSettingsPage />
        </PrivateRoute>
      } />
      
      <Route path="/profile" element={
        <PrivateRoute>
          <MobileProfilePage />
        </PrivateRoute>
      } />
      
      {/* Support routes */}
      <Route path="/support" element={
        <PrivateRoute>
          <MobileSupportPage />
        </PrivateRoute>
      } />
      
      <Route path="/support/:id" element={
        <PrivateRoute>
          <MobileTicketDetailPage />
        </PrivateRoute>
      } />
      
      {/* We can remove the /support/new route since it's now handled within MobileSupportPage */}
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default MobileRoutes;
