import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoonIcon,
  SunIcon,
  LanguageIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';
import { useAuth } from '../../context/AuthContext';

const MobileSettingsPage = () => {
  const { logout, user } = useAuth() || { user: {}, logout: () => {} };
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };
  
  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your app preferences and account
        </p>
      </div>
      
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow mb-6 overflow-hidden">
        <div className="p-4 flex items-center border-b border-gray-100" onClick={() => navigate('/profile')}>
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-4">
            <p className="font-medium text-gray-900">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email || 'User'}
            </p>
            <p className="text-sm text-gray-500">View and edit your profile</p>
          </div>
          <ArrowRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
        </div>
      </div>
      
      {/* App Preferences Section */}
      <div className="bg-white rounded-xl shadow mb-6 overflow-hidden">
        <h2 className="px-4 pt-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
          App Preferences
        </h2>
        
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center">
            {darkMode ? (
              <MoonIcon className="h-6 w-6 text-indigo-600 mr-3" />
            ) : (
              <SunIcon className="h-6 w-6 text-amber-500 mr-3" />
            )}
            <span className="font-medium">Dark Mode</span>
          </div>
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            className={`${darkMode ? 'bg-primary-600' : 'bg-gray-200'} 
                      relative inline-flex flex-shrink-0 h-6 w-11 
                      border-2 border-transparent rounded-full 
                      transition-colors ease-in-out duration-200 focus:outline-none`}
          >
            <span
              className={`${darkMode ? 'translate-x-5' : 'translate-x-0'}
                        pointer-events-none inline-block h-5 w-5 rounded-full
                        bg-white shadow transform transition ease-in-out duration-200`}
            />
          </Switch>
        </div>
        
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center">
            <BellIcon className="h-6 w-6 text-primary-600 mr-3" />
            <span className="font-medium">Notifications</span>
          </div>
          <Switch
            checked={notifications}
            onChange={setNotifications}
            className={`${notifications ? 'bg-primary-600' : 'bg-gray-200'} 
                      relative inline-flex flex-shrink-0 h-6 w-11 
                      border-2 border-transparent rounded-full 
                      transition-colors ease-in-out duration-200 focus:outline-none`}
          >
            <span
              className={`${notifications ? 'translate-x-5' : 'translate-x-0'}
                        pointer-events-none inline-block h-5 w-5 rounded-full
                        bg-white shadow transform transition ease-in-out duration-200`}
            />
          </Switch>
        </div>
        
        <div className="p-4 flex items-center justify-between border-b border-gray-100" onClick={() => navigate('/language')}>
          <div className="flex items-center">
            <LanguageIcon className="h-6 w-6 text-primary-600 mr-3" />
            <span className="font-medium">Language</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">English</span>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Security Section */}
      <div className="bg-white rounded-xl shadow mb-6 overflow-hidden">
        <h2 className="px-4 pt-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
          Security
        </h2>
        
        <div className="p-4 flex items-center justify-between border-b border-gray-100" onClick={() => navigate('/security')}>
          <div className="flex items-center">
            <ShieldCheckIcon className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <span className="font-medium block">Security Settings</span>
              <span className="text-xs text-gray-500">2FA, Password</span>
            </div>
          </div>
          <ArrowRightIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Support & About Section */}
      <div className="bg-white rounded-xl shadow mb-6 overflow-hidden">
        <h2 className="px-4 pt-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
          More
        </h2>
        
        <div className="p-4 flex items-center justify-between border-b border-gray-100" onClick={() => navigate('/support')}>
          <div className="flex items-center">
            <QuestionMarkCircleIcon className="h-6 w-6 text-primary-600 mr-3" />
            <span className="font-medium">Help & Support</span>
          </div>
          <ArrowRightIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="p-4 flex items-center justify-between border-b border-gray-100" onClick={() => navigate('/about')}>
          <div className="flex items-center">
            <CogIcon className="h-6 w-6 text-primary-600 mr-3" />
            <span className="font-medium">About</span>
          </div>
          <ArrowRightIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Logout button */}
      <button 
        onClick={handleLogout}
        className="w-full py-3 bg-red-50 text-red-600 font-medium rounded-lg shadow-sm"
      >
        Log Out
      </button>
    </div>
  );
};

export default MobileSettingsPage;
