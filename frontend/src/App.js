import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import soundUtils from './utils/soundUtils';

// Main Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StakingPage from './pages/StakingPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import ReferralPage from './pages/ReferralPage';
import ProfilePage from './pages/ProfilePage';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import DepositsPage from './pages/admin/DepositsPage';
import WithdrawalsPage from './pages/admin/WithdrawalsPage';
import StakingsPage from './pages/admin/StakingsPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminLoginPage from './pages/AdminLoginPage';

// Import the new ticket pages
import SupportPage from './pages/SupportPage';
import NewTicketPage from './pages/NewTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import AdminTicketsPage from './pages/admin/TicketsPage';
import AdminTicketDetailPage from './pages/admin/TicketDetailPage';

// Import forum and admin forum related pages
import ForumPage from './pages/ForumPage';
import ForumCategoryPage from './pages/ForumCategoryPage';
import ForumThreadPage from './pages/ForumThreadPage';
import NewThreadPage from './pages/NewThreadPage';
import ForumManagementPage from './pages/admin/ForumManagementPage';

// New Information Pages
import WhitepaperPage from './pages/WhitepaperPage';
import DocumentationPage from './pages/DocumentationPage';
import SecurityPage from './pages/SecurityPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';

// Import NotFoundPage
import NotFoundPage from './pages/NotFoundPage';
import NotificationsPage from './pages/NotificationsPage';
import DepositDetailPage from './pages/DepositDetailPage'; // Add this import
import AdminNotificationsPage from './pages/admin/NotificationsPage';

// Add this import near your other imports
import MobileAccountDetector from './components/mobile/MobileAccountDetector';

function App() {
  console.log("App is rendering - Forum routes should be defined");

  // Initialize audio on first user interaction
  useEffect(() => {
    const initAudio = () => {
      // Create and initialize the audio context
      soundUtils.getAudioContext();
      
      // Remove event listeners once initialized
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };

    // Add event listeners for user interaction
    document.addEventListener('click', initAudio);
    document.addEventListener('touchstart', initAudio);

    return () => {
      // Clean up
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, []);
  
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          {/* Public routes with main layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="auth/google/callback" element={<GoogleAuthSuccess />} />
            
            {/* Add Admin Login Route */}
            <Route path="admin/login" element={<AdminLoginPage />} />
            
            {/* Protected routes */}
            <Route path="dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="staking" element={<PrivateRoute><StakingPage /></PrivateRoute>} />
            <Route path="deposit" element={<PrivateRoute><DepositPage /></PrivateRoute>} />
            <Route path="withdraw" element={<PrivateRoute><WithdrawPage /></PrivateRoute>} />
            <Route path="referral" element={<PrivateRoute><ReferralPage /></PrivateRoute>} />
            <Route path="profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            
            {/* Support ticket routes */}
            <Route path="support" element={<PrivateRoute><SupportPage /></PrivateRoute>} />
            <Route path="support/new" element={<PrivateRoute><NewTicketPage /></PrivateRoute>} />
            <Route path="support/:id" element={<PrivateRoute><TicketDetailPage /></PrivateRoute>} />
          </Route>
          
          {/* Forum routes - public */}
          <Route 
            path="/forum" 
            element={
              <Layout>
                <ForumPage />
              </Layout>
            }
          />
          
          <Route 
            path="/forum/category/:slug" 
            element={
              <Layout>
                <ForumCategoryPage />
              </Layout>
            }
          />
          
          <Route 
            path="/forum/thread/:id/:slug" 
            element={
              <Layout>
                <ForumThreadPage />
              </Layout>
            }
          />
          
          <Route 
            path="/forum/new-thread" 
            element={
              <PrivateRoute>
                <Layout>
                  <NewThreadPage />
                </Layout>
              </PrivateRoute>
            } 
          />

          {/* Information pages */}
          <Route path="/whitepaper" element={<Layout><WhitepaperPage /></Layout>} />
          <Route path="/documentation" element={<Layout><DocumentationPage /></Layout>} />
          <Route path="/security" element={<Layout><SecurityPage /></Layout>} />
          <Route path="/terms-of-service" element={<Layout><TermsOfServicePage /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />
          <Route path="/cookie-policy" element={<Layout><CookiePolicyPage /></Layout>} />

          {/* Admin routes with admin layout */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="deposits" element={<DepositsPage />} />
            <Route path="withdrawals" element={<WithdrawalsPage />} />
            <Route path="stakings" element={<StakingsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            
            {/* Admin ticket routes */}
            <Route path="tickets" element={<AdminTicketsPage />} />
            <Route path="tickets/:id" element={<AdminTicketDetailPage />} />
            
            {/* Admin forum management route */}
            <Route
              path="/admin/forum"
              element={
                <AdminRoute>
                
                    <ForumManagementPage />
                 
                </AdminRoute>
              }
            />
            {/* Add the Admin Notifications page */}
            <Route path="notifications" element={<AdminRoute><AdminLayout><AdminNotificationsPage /></AdminLayout></AdminRoute>} />
          </Route>

          {/* Add the deposit detail route */}
          <Route 
            path="/dashboard/deposits/:id" 
            element={
              <PrivateRoute>
                <Layout>
                  <DepositDetailPage />
                </Layout>
              </PrivateRoute>
            } 
          />

          {/* Add the settings route */}
          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </PrivateRoute>
            } 
          />
         
          {/* Notifications route */}
          <Route 
            path="/notifications" 
            element={
              <PrivateRoute>
                <Layout>
                  <NotificationsPage />
                </Layout>
              </PrivateRoute>
            } 
          />

          {/* Add the account route */}
          <Route path="/account" element={
            <PrivateRoute>
              <MobileAccountDetector>
                <ProfilePage /> {/* Or whatever you want to show on desktop */}
              </MobileAccountDetector>
            </PrivateRoute>
          } />

          {/* Fallback route */}
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
        <ToastContainer position="bottom-right" />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
