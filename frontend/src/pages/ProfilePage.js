import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../utils/axios';

const ProfilePage = () => {
  const { user } = useAuth();
  const [withdrawalWalletAddress, setWithdrawalWalletAddress] = useState(user?.withdrawalWalletAddress || '');
  const [loading, setLoading] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [activeShareOption, setActiveShareOption] = useState('code');

  const handleUpdateWithdrawalAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    
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
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleShareReferral = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join Titan Staking Platform',
          text: `Join Titan Staking Platform using my referral code: ${user.referralCode}. Earn up to 3% weekly on your USDT investments!`,
          url: `${window.location.origin}/register?ref=${user.referralCode}`
        });
      } else {
        copyToClipboard(
          activeShareOption === 'code' 
            ? user?.referralCode 
            : `${window.location.origin}/register?ref=${user?.referralCode}`
        );
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(
        activeShareOption === 'code' 
          ? 'Referral code copied to clipboard!' 
          : 'Referral link copied to clipboard!'
      );
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    });
  };

  return (
    <div className="space-y-6">
      {/* Account Settings Card */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Account Settings</h3>
            <p className="mt-1 text-sm text-gray-500">
              View your account details and manage login credentials.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Your email address cannot be changed.
                </p>
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">
                  Account Wallet Address
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="text"
                    value={user?.walletAddress || 'No wallet address connected'}
                    disabled
                    className="block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700 font-mono text-sm"
                  />
                  {user?.walletAddress && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(user.walletAddress);
                        toast.success('Wallet address copied to clipboard!');
                      }}
                      className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                      title="Copy wallet address"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This is the wallet address associated with your account.
                </p>
              </div>

              {!isEditingPassword ? (
                <div className="col-span-6">
                  <button
                    type="button"
                    onClick={() => setIsEditingPassword(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Change Password
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdatePassword} className="col-span-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Save Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingPassword(false)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Settings Card */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6" id="withdrawal-settings">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Withdrawal Settings</h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure your withdrawal wallet address for receiving payments.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleUpdateWithdrawalAddress}>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    USDT Withdrawal Address (TRC20)
                  </label>
                  <input
                    type="text"
                    value={withdrawalWalletAddress}
                    onChange={(e) => setWithdrawalWalletAddress(e.target.value)}
                    placeholder="Enter your TRC20 wallet address for withdrawals"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    This address will be used for all your withdrawal requests. Make sure to enter a valid TRC20 address.
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  {loading ? 'Saving...' : 'Save Withdrawal Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Account Information Card with fixed social links */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Account Information</h3>
            <p className="mt-1 text-sm text-gray-500">
              View your account details and statistics.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Account Balance</dt>
                <dd className="mt-1 text-sm text-gray-900">${user?.balance?.toFixed(2) || '0.00'} USDT</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Referral Code</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.referralCode || '-'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Referral Earnings</dt>
                <dd className="mt-1 text-sm text-gray-900">${user?.referralEarnings?.toFixed(2) || '0.00'} USDT</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</dd>
              </div>
              
              <div className="sm:col-span-2 space-y-6" id="referral-options">
                <h4 className="text-lg font-medium text-gray-900">Share Your Referral</h4>
                
                {/* Share Options Toggle */}
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    onClick={() => setActiveShareOption('code')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeShareOption === 'code'
                        ? 'bg-white shadow-sm text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Share Code
                  </button>
                  <button
                    onClick={() => setActiveShareOption('link')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeShareOption === 'link'
                        ? 'bg-white shadow-sm text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Share Link
                  </button>
                </div>
              
                {/* Referral Code */}
                {activeShareOption === 'code' && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Referral Code</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <div className="relative flex-grow min-w-0">
                          <input
                            type="text"
                            className="form-input pr-12"
                            value={user?.referralCode || ''}
                            readOnly
                          />
                          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(user?.referralCode || '')}
                              className="inline-flex items-center border border-gray-300 px-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                              Copy Code
                            </button>
                          </div>
                        </div>
                      </div>
                    </dd>
                  </div>
                )}

                {/* Referral Link */}
                {activeShareOption === 'link' && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Referral Link</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative flex-grow min-w-0">
                          <input
                            type="text"
                            className="form-input pr-12"
                            value={`${window.location.origin}/register?ref=${user?.referralCode}`}
                            readOnly
                          />
                          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(`${window.location.origin}/register?ref=${user?.referralCode}`)}
                              className="inline-flex items-center border border-gray-300 px-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                              Copy Link
                            </button>
                          </div>
                        </div>
                      </div>
                    </dd>
                  </div>
                )}

                {/* Share on social buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleShareReferral}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {navigator.share ? 'Share' : activeShareOption === 'code' ? 'Copy Code' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;