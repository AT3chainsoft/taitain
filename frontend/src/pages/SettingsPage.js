import React from 'react';
import MobileSettingsDetector from '../components/mobile/MobileSettingsDetector';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  
  // Desktop version of settings - will only show on larger screens
  const DesktopSettings = () => (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
      
      {/* Settings content for desktop - this won't show on mobile due to the detector */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.firstName} {user?.lastName}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.email}
              </dd>
            </div>
            {/* Additional settings sections would go here */}
          </dl>
        </div>
      </div>
      
      <div className="mt-6 flex">
        <button
          onClick={() => logout()}
          className="ml-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
        >
          Log out
        </button>
      </div>
    </div>
  );
  
  return (
    <MobileSettingsDetector>
      <DesktopSettings />
    </MobileSettingsDetector>
  );
};

export default SettingsPage;
