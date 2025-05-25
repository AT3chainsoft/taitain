import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';
import { Link } from 'react-router-dom';
import {
  UserCircleIcon,
  CogIcon,
  ArrowRightIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const MobileAccountPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // State for withdrawal address
  const [withdrawalWalletAddress, setWithdrawalWalletAddress] = useState(user?.withdrawalWalletAddress || '');
  const [loadingAddress, setLoadingAddress] = useState(false);
  
  // Password change states
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  
  // Referral states
  const [activeShareOption, setActiveShareOption] = useState('code');
  const [copied, setCopied] = useState(false);
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };
  
  const handleUpdateWithdrawalAddress = async (e) => {
    e.preventDefault();
    setLoadingAddress(true);
    
    try {
      const response = await axios.put('/api/users/withdrawal-address', {
        withdrawalWalletAddress
      });
      
      if (response.data.success) {
        toast.success('Withdrawal address updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update withdrawal address');
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoadingPassword(true);
    try {
      const response = await axios.put('/api/users/password', {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        toast.success('Password updated successfully');
        setIsEditingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setLoadingPassword(false);
    }
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success(
        activeShareOption === 'code' 
          ? 'Referral code copied to clipboard!' 
          : 'Referral link copied to clipboard!'
      );
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    });
  };
  
  const handleShareReferral = async () => {
    try {
      const textToCopy = activeShareOption === 'code' 
        ? user?.referralCode 
        : `${window.location.origin}/register?ref=${user?.referralCode}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Join Titan Staking Platform',
          text: `Join Titan Staking Platform using my referral code: ${user?.referralCode}. Earn up to 3% weekly on your USDT investments!`,
          url: `${window.location.origin}/register?ref=${user?.referralCode}`
        });
      } else {
        copyToClipboard(textToCopy);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Tab navigation component
  const TabNavigation = () => (
    <div className="flex border-b border-gray-200 mb-4">
      <button
        className={`py-2 px-4 text-sm font-medium ${
          activeTab === 'profile'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('profile')}
      >
        Profile
      </button>
      <button
        className={`py-2 px-4 text-sm font-medium ${
          activeTab === 'settings'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('settings')}
      >
        Settings
      </button>
      <button
        className={`py-2 px-4 text-sm font-medium ${
          activeTab === 'referral'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('referral')}
      >
        Referrals
      </button>
    </div>
  );

  // Profile tab content
  const ProfileTab = () => (
    <div className="space-y-4">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900">
            Account Information
          </h3>
        </div>
        <div className="px-4 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-xs text-gray-700"
            />
            <p className="mt-1 text-xs text-gray-500">
              Your email address cannot be changed.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Account Wallet Address
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="text"
                value={user?.walletAddress || 'No wallet address connected'}
                disabled
                className="block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-xs text-gray-700 font-mono"
              />
              {user?.walletAddress && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user.walletAddress);
                    toast.success('Wallet address copied!');
                  }}
                  className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                  title="Copy wallet address"
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              This is the wallet address associated with your account.
            </p>
          </div>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900">
            Account Statistics
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <dt className="text-xs font-medium text-gray-500">Balance</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900">${user?.balance?.toFixed(2) || '0.00'}</dd>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <dt className="text-xs font-medium text-gray-500">Referral Code</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900">{user?.referralCode || '-'}</dd>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <dt className="text-xs font-medium text-gray-500">Referral Earnings</dt>
            <dd className="mt-1 text-sm font-medium text-green-600">${user?.referralEarnings?.toFixed(2) || '0.00'}</dd>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <dt className="text-xs font-medium text-gray-500">Member Since</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</dd>
          </div>
        </div>
      </div>
    </div>
  );

  // Settings tab content
  const SettingsTab = () => (
    <div className="space-y-4">
      {/* Withdrawal Settings */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden" id="withdrawal-settings">
        <div className="px-4 py-4 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900">
            Withdrawal Settings
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Configure your withdrawal wallet address for receiving payments
          </p>
        </div>
        <form onSubmit={handleUpdateWithdrawalAddress} className="px-4 py-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              USDT Withdrawal Address (TRC20)
            </label>
            <input
              type="text"
              value={withdrawalWalletAddress}
              onChange={(e) => setWithdrawalWalletAddress(e.target.value)}
              placeholder="Enter your TRC20 wallet address for withdrawals"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-xs"
            />
            <p className="mt-1 text-xs text-gray-500">
              This address will be used for all your withdrawal requests.
            </p>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={loadingAddress}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {loadingAddress ? 'Saving...' : 'Save Withdrawal Address'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Password Settings */}
     
      
      {/* Additional settings options */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900">
            Other Settings
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center">
              <BellIcon className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-xs">Notifications</span>
            </div>
            <ArrowRightIcon className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="px-4 py-3">
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-50 text-red-600 text-xs font-medium rounded-md shadow-sm"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Referral tab content
  const ReferralTab = () => (
    <div className="space-y-4">
      {/* Referral Program Card */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <h3 className="text-base font-medium">
            Your Referral Program
          </h3>
          <p className="mt-1 text-xs text-primary-50">
            Earn 5% of your friends' first investment
          </p>
        </div>
        
        {/* Share Options */}
        <div className="p-4">
          {/* Toggle between code and link */}
          <div className="bg-gray-100 rounded-lg p-1 flex mb-4">
            <button
              onClick={() => setActiveShareOption('code')}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium ${
                activeShareOption === 'code'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-gray-500'
              }`}
            >
              Share Code
            </button>
            <button
              onClick={() => setActiveShareOption('link')}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium ${
                activeShareOption === 'link'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-gray-500'
              }`}
            >
              Share Link
            </button>
          </div>
          
          {activeShareOption === 'code' ? (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Referral Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={user?.referralCode || ''}
                  readOnly
                  className="w-full py-2 pr-16 pl-3 text-xs border border-gray-300 rounded-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(user?.referralCode || '')}
                    className={`px-2 py-0.5 text-xs font-medium rounded border ${copied ? 'border-green-200 text-green-600 bg-green-50' : 'border-gray-300 text-gray-600'}`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Referral Link
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={`${window.location.origin}/register?ref=${user?.referralCode}`}
                  readOnly
                  className="w-full py-2 pr-16 pl-3 text-xs border border-gray-300 rounded-md font-mono"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`${window.location.origin}/register?ref=${user?.referralCode}`)}
                    className={`px-2 py-0.5 text-xs font-medium rounded border ${copied ? 'border-green-200 text-green-600 bg-green-50' : 'border-gray-300 text-gray-600'}`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleShareReferral}
            className="mt-4 w-full flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600"
          >
            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {navigator.share ? 'Share' : activeShareOption === 'code' ? 'Copy Code' : 'Copy Link'}
          </button>
        </div>
        
        {/* Referral Stats */}
        <div className="border-t border-gray-100 p-4">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Your Referral Stats</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-2 rounded-md">
              <dt className="text-xs text-gray-500">Earned</dt>
              <dd className="text-sm font-medium text-green-600">${user?.referralEarnings?.toFixed(2) || '0.00'}</dd>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <dt className="text-xs text-gray-500">Total Referrals</dt>
              <dd className="text-sm font-medium text-gray-900">{user?.referralsCount || 0}</dd>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/referral"
              className="text-xs text-primary-600 font-medium flex items-center justify-center"
            >
              View detailed referral information
              <ArrowRightIcon className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-16">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 pt-6 pb-8 px-4 text-white">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-primary-500 bg-opacity-50 flex items-center justify-center">
            <UserCircleIcon className="h-12 w-12 text-white" />
          </div>
          <div className="ml-4">
            <h1 className="text-xl font-bold">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Your Account'}
            </h1>
            <p className="text-sm text-primary-100 truncate max-w-[200px]">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="px-4">
        <TabNavigation />
        
        {/* Tab Content */}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'referral' && <ReferralTab />}
      </div>
    </div>
  );
};

export default MobileAccountPage;
