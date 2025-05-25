import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const WithdrawConfirmationModal = ({ isOpen, onClose, onConfirm, amount, user }) => (
  <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`}>
    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-4 max-w-xs w-full">
      <h3 className="text-base font-medium mb-3">Confirm Withdrawal</h3>
      
      {!user?.withdrawalWalletAddress ? (
        <div>
          <div className="mb-3 p-3 bg-yellow-50 rounded-md">
            <div className="flex items-start">
              <svg className="h-4 w-4 text-yellow-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="ml-2">
                <h3 className="text-xs font-medium text-yellow-800">Withdrawal Address Required</h3>
                <p className="mt-1 text-xs text-yellow-700">
                  Please set up your withdrawal wallet address in your profile settings.
                </p>
                <div className="mt-2">
                  <Link
                    to="/profile#withdrawal-settings"
                    className="text-xs font-medium text-yellow-800 hover:text-yellow-600"
                  >
                    Set Withdrawal Address →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gray-50 p-3 rounded-md mb-3">
            <div className="mb-2">
              <span className="text-xs text-gray-600">Amount:</span>
              <span className="ml-1 font-medium text-sm">${amount} USDT</span>
            </div>
            <div>
              <span className="text-xs text-gray-600">Withdrawal Address:</span>
              <div className="mt-1 font-mono text-xs bg-white p-1.5 rounded border break-all flex justify-between items-center">
                <div className="truncate pr-1">{user.withdrawalWalletAddress}</div>
                <Link
                  to="/profile#withdrawal-settings"
                  className="ml-1 text-xs text-primary-600 hover:text-primary-700 whitespace-nowrap"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-md mb-4 text-xs">
            <div className="flex items-start">
              <svg className="h-4 w-4 text-yellow-400 mt-px" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="ml-2">
                <p className="text-xs text-yellow-800">
                  Please verify this is a valid TRC20 wallet address. Withdrawals sent to incorrect addresses cannot be recovered.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            >
              Confirm
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

const MobileReferralPage = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState({
    referralCount: 0,
    referralEarnings: 0,
    referralCode: user?.referralCode || ''
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [activeShareOption, setActiveShareOption] = useState('link');
  const [activeTab, setActiveTab] = useState('info'); // Added tab navigation

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/referrals');
        
        if (response.data.success) {
          setReferrals(response.data.data || []);
          setStats({
            referralCount: response.data.data?.length || 0,
            referralEarnings: user?.referralEarnings || 0,
            referralCode: user?.referralCode || ''
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching referral data:', err);
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [user]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleShareOnSocial = (platform) => {
    let shareUrl;
    const referralLink = `${window.location.origin}/register?ref=${stats?.referralCode}`;
    const shareMessage = `Join Titan Staking Platform and earn up to 3% weekly on your USDT investments! Use my referral link:`;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(referralLink)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareMessage)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareMessage} ${referralLink}`)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(shareMessage)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

  const handleWithdrawClick = () => {
    if (!user.referralEarnings || user.referralEarnings <= 0) {
      toast.error('No referral earnings available to withdraw');
      return;
    }
    setShowWithdrawModal(true);
  };

  const handleWithdrawConfirm = async () => {
    try {
      const response = await axios.post('/api/withdrawals/referral', {
        amount: user.referralEarnings,
        type: 'ReferralEarnings'
      });

      if (response.data.success) {
        toast.success('Withdrawal request submitted');
        setShowWithdrawModal(false);
        window.location.reload();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to withdraw');
    }
  };

  const handleShareReferral = () => {
    const textToCopy = activeShareOption === 'code' 
      ? stats?.referralCode 
      : `${window.location.origin}/register?ref=${stats?.referralCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Titan Staking Platform',
        text: `Join Titan Staking Platform${activeShareOption === 'code' ? ` using my referral code: ${stats?.referralCode}` : ''}. Earn up to 3% weekly!`,
        url: `${window.location.origin}/register?ref=${stats?.referralCode}`
      }).catch(err => {
        console.error('Share failed:', err);
        copyToClipboard(textToCopy);
      });
    } else {
      copyToClipboard(textToCopy);
    }
  };

  // Tab navigation component
  const TabNavigation = () => (
    <div className="flex border-b border-gray-200 mb-4">
      <button
        className={`py-2 px-3 text-sm font-medium ${
          activeTab === 'info'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('info')}
      >
        Share & Earn
      </button>
      <button
        className={`py-2 px-3 text-sm font-medium ${
          activeTab === 'referrals'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('referrals')}
      >
        Your Referrals
      </button>
      <button
        className={`py-2 px-3 text-sm font-medium ${
          activeTab === 'how'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('how')}
      >
        How It Works
      </button>
    </div>
  );

  const ReferralInfo = () => (
    <div className="space-y-4">
      {/* Referral summary card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <h3 className="text-sm font-semibold">Your Referral Program</h3>
          <p className="text-xs mt-1 text-primary-50">
            Earn 5% of your friends' first investment amount
          </p>
        </div>
        
        <div className="p-3 flex justify-between items-center">
          <div className="text-xs">
            <span className="text-gray-500">Total Referrals:</span>{' '}
            <span className="font-medium">{stats.referralCount}</span>
          </div>
          <div className="text-xs">
            <span className="text-gray-500">Total Earnings:</span>{' '}
            <span className="font-medium text-green-600">${stats.referralEarnings?.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="p-3 bg-gray-50 flex justify-center">
          <button
            onClick={handleWithdrawClick}
            disabled={!user.referralEarnings || user.referralEarnings <= 0}
            className="w-full py-2 px-3 bg-primary-600 text-white text-xs font-medium rounded-md disabled:bg-gray-300 disabled:text-gray-500"
          >
            Withdraw Earnings (${user.referralEarnings?.toFixed(2) || '0.00'})
          </button>
        </div>
      </div>

      {/* Share section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">
            Share Your Referral
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Share with friends to earn bonuses
          </p>
        </div>
        
        <div className="p-3 space-y-3">
          {/* Toggle between code and link */}
          <div className="bg-gray-100 rounded-lg p-1 flex">
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
              <p className="text-xs font-medium text-gray-700 mb-1">Referral Code:</p>
              <div className="relative">
                <input
                  type="text"
                  className="w-full py-2 pr-16 pl-3 text-xs border border-gray-300 rounded-md"
                  value={stats?.referralCode || ''}
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(stats?.referralCode || '')}
                    className={`px-2 py-0.5 text-xs font-medium rounded border ${copied ? 'border-green-200 text-green-600 bg-green-50' : 'border-gray-300 text-gray-600'}`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Referral Link:</p>
              <div className="relative">
                <input
                  type="text"
                  className="w-full py-2 pr-16 pl-3 text-xs border border-gray-300 rounded-md font-mono"
                  value={`${window.location.origin}/register?ref=${stats?.referralCode}`}
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`${window.location.origin}/register?ref=${stats?.referralCode}`)}
                    className={`px-2 py-0.5 text-xs font-medium rounded border ${copied ? 'border-green-200 text-green-600 bg-green-50' : 'border-gray-300 text-gray-600'}`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleShareReferral}
              className="flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600"
            >
              <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {navigator.share ? 'Share' : activeShareOption === 'code' ? 'Copy Code' : 'Copy Link'}
            </button>
            
            <p className="text-xs font-medium text-gray-700">Or share directly:</p>
            <div className="flex justify-between">
              <button 
                onClick={() => handleShareOnSocial('whatsapp')}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex-1 mx-0.5 flex items-center justify-center"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.004 22l1.352-4.968A9.954 9.954 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.954 9.954 0 0 1-5.03-1.355L2.004 22zM8.391 7.308a.961.961 0 0 0-.371.1 1.293 1.293 0 0 0-.294.228c-.12.113-.188.211-.261.306A2.729 2.729 0 0 0 6.9 9.62c.002.49.13.967.33 1.413.409.902 1.082 1.857 1.971 2.742.214.213.423.427.648.626a9.448 9.448 0 0 0 3.84 2.046l.569.087c.185.01.37-.004.556-.013a1.99 1.99 0 0 0 .833-.231c.166-.088.244-.132.383-.22 0 0 .043-.028.125-.09.135-.1.218-.171.33-.288.083-.086.155-.187.21-.302.078-.163.156-.474.188-.733.024-.198.017-.306.014-.373-.004-.107-.093-.218-.19-.265l-.582-.261s-.87-.379-1.401-.621a.498.498 0 0 0-.177-.041.482.482 0 0 0-.378.127v-.002c-.005 0-.072.057-.795.933a.35.35 0 0 1-.368.13 1.416 1.416 0 0 1-.191-.066c-.124-.052-.167-.072-.252-.109l-.005-.002a6.01 6.01 0 0 1-1.57-1c-.126-.11-.243-.23-.363-.346a6.296 6.296 0 0 1-1.02-1.268l-.059-.095a.923.923 0 0 1-.102-.205c-.038-.147.061-.265.061-.265s.243-.266.356-.41a4.38 4.38 0 0 0 .263-.373c.118-.19.155-.385.093-.536-.28-.684-.57-1.365-.868-2.041-.059-.134-.234-.23-.393-.249-.054-.006-.108-.012-.162-.016a3.385 3.385 0 0 0-.403.004z"/>
                </svg>
              </button>
              <button
                onClick={() => handleShareOnSocial('telegram')}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex-1 mx-0.5 flex items-center justify-center"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                </svg>
              </button>
              <button
                onClick={() => handleShareOnSocial('twitter')}
                className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded flex-1 mx-0.5 flex items-center justify-center"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button
                onClick={() => handleShareOnSocial('facebook')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded flex-1 mx-0.5 flex items-center justify-center"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 6.477 2 12 6.477 12 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ReferralsList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    if (!referrals.length) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="bg-gray-100 mx-auto h-12 w-12 rounded-full flex items-center justify-center">
            <UserGroupIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium">No referrals yet</h3>
          <p className="mt-1 text-xs text-gray-500">
            Share your code to start earning bonuses
          </p>
          <button
            onClick={() => {
              setActiveTab('info');
              setTimeout(() => {
                handleShareReferral();
              }, 300);
            }}
            className="mt-3 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-primary-600"
          >
            Share Your Code
          </button>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">
            Your Referrals
          </h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {referrals.map((referral) => (
            <div key={referral._id} className="p-3 flex items-center">
              <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <UserGroupIcon className="h-4 w-4 text-primary-600" />
              </div>
              <div className="ml-3">
                <div className="text-xs font-medium text-gray-900 truncate max-w-[180px]">{referral.email}</div>
                <div className="text-xs text-gray-500">
                  {new Date(referral.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const HowItWorks = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">
          How Referrals Work
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Learn how to earn with referrals
        </p>
      </div>
      
      <div className="p-3 space-y-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100">
              <span className="text-sm font-bold text-primary-600">1</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-xs font-medium text-gray-900">Share Your Link</h4>
            <p className="mt-1 text-xs text-gray-500">
              Share your referral code with friends on social media or messaging apps.
            </p>
          </div>
        </div>

        <div className="flex">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100">
              <span className="text-sm font-bold text-primary-600">2</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-xs font-medium text-gray-900">Friends Sign Up & Stake</h4>
            <p className="mt-1 text-xs text-gray-500">
              When someone uses your link to register and makes their first investment.
            </p>
          </div>
        </div>

        <div className="flex">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100">
              <span className="text-sm font-bold text-primary-600">3</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-xs font-medium text-gray-900">Earn Bonus</h4>
            <p className="mt-1 text-xs text-gray-500">
              You'll receive 5% of their first investment as a referral bonus.
            </p>
          </div>
        </div>

        <div className="flex">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100">
              <span className="text-sm font-bold text-primary-600">4</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-xs font-medium text-gray-900">Withdraw Earnings</h4>
            <p className="mt-1 text-xs text-gray-500">
              Withdraw your referral earnings anytime from this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-16"> {/* Bottom padding for mobile navigation */}
      <TabNavigation />
      
      {activeTab === 'info' && <ReferralInfo />}
      {activeTab === 'referrals' && <ReferralsList />}
      {activeTab === 'how' && <HowItWorks />}
      
      <WithdrawConfirmationModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={handleWithdrawConfirm}
        amount={user?.referralEarnings}
        user={user}
      />
    </div>
  );
};

export default MobileReferralPage;
