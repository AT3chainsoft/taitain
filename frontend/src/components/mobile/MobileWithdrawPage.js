import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const WithdrawModal = ({ isOpen, onClose, onConfirm, amount, walletAddress, useProfileWallet, onWalletChange, onUseProfileWallet }) => {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-black bg-opacity-50 absolute inset-0" onClick={onClose}></div>
      <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-4 max-w-xs w-full">
        <h3 className="text-base font-medium text-gray-900 mb-3">Confirm Withdrawal</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Amount to withdraw:</p>
            <p className="text-sm font-bold text-gray-900">${amount} USDT</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="useProfileWallet"
                checked={useProfileWallet}
                onChange={onUseProfileWallet}
                className="mr-2"
              />
              <label htmlFor="useProfileWallet" className="text-xs text-gray-700">
                Use wallet address from profile
              </label>
            </div>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => onWalletChange(e.target.value)}
              disabled={useProfileWallet}
              placeholder="Enter TRC20 wallet address"
              className="mt-1 w-full px-3 py-2 text-xs border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">Make sure this is a valid TRC20 wallet address</p>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!walletAddress}
              className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-md disabled:opacity-50"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileWithdrawPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingCompletedStakings, setLoadingCompletedStakings] = useState(true);
  const [completedStakings, setCompletedStakings] = useState([]);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('staking');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [useProfileWallet, setUseProfileWallet] = useState(true);
  const [withdrawalData, setWithdrawalData] = useState(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  
  // Form states
  const [stakingId, setStakingId] = useState('');
  const [amount, setAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      setWalletAddress(user.walletAddress || '');
    }
    
    fetchData();
  }, [user]);
  
  const fetchData = async () => {
    try {
      // Fetch withdrawal history
      const withdrawResponse = await axios.get('/api/withdrawals');
      setWithdrawHistory(withdrawResponse.data.data);
      setLoading(false);
      
      // Fetch completed stakings
      const stakingsResponse = await axios.get('/api/staking');
      const completed = stakingsResponse.data.data.filter(
        staking => staking.status === 'Completed' && staking.profitsEarned > 0
      );
      setCompletedStakings(completed);
      setLoadingCompletedStakings(false);
    } catch (error) {
      toast.error('Failed to load data');
      setLoading(false);
      setLoadingCompletedStakings(false);
    }
  };
  
  const handleStakingSelect = (e) => {
    const selectedId = e.target.value;
    setStakingId(selectedId);
    
    if (selectedId) {
      const staking = completedStakings.find(s => s._id === selectedId);
      if (staking) {
        setMaxAmount(staking.profitsEarned);
        setAmount(staking.profitsEarned);
      }
    } else {
      setMaxAmount(0);
      setAmount(0);
    }
  };
  
  const handleSubmitStakingWithdrawal = async (e) => {
    e.preventDefault();
    setWithdrawalData({
      type: 'staking',
      stakingId,
      amount,
      walletAddress: useProfileWallet ? user?.walletAddress : walletAddress
    });
    setShowConfirmModal(true);
  };
  
  const handleSubmitReferralWithdrawal = async (e) => {
    e.preventDefault();
    setWithdrawalData({
      type: 'referral',
      amount: user.referralEarnings,
      walletAddress: useProfileWallet ? user?.walletAddress : walletAddress
    });
    setShowConfirmModal(true);
  };

  const handleConfirmWithdrawal = async () => {
    try {
      setIsSubmitting(true);
      const endpoint = withdrawalData.type === 'staking' ? 'withdrawals/staking' : 'withdrawals/referral';
      
      const response = await axios.post(`/api/${endpoint}`, withdrawalData);
      
      if (response.data.success) {
        toast.success('Withdrawal request submitted');
        fetchData(); // Refresh data
        setShowConfirmModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit withdrawal request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Tab navigation
  const TabNavigation = () => (
    <div className="flex border-b border-gray-200 mb-4">
      <button
        className={`py-2 px-4 text-sm font-medium ${
          activeTab === 'staking'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('staking')}
      >
        Staking Profits
      </button>
      <button
        className={`py-2 px-4 text-sm font-medium ${
          activeTab === 'referral'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('referral')}
      >
        Referral Earnings
      </button>
    </div>
  );

  const renderStakingProfitTab = () => (
    <div className="space-y-4">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-3 py-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900">
            Withdraw Staking Profits
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Withdraw from completed stakings
          </p>
        </div>
        
        <div className="px-3 py-3">
          {loadingCompletedStakings ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          ) : completedStakings.length > 0 ? (
            <form onSubmit={handleSubmitStakingWithdrawal} className="space-y-3">
              <div>
                <label htmlFor="stakingId" className="block text-xs font-medium text-gray-700">
                  Select Staking
                </label>
                <select
                  id="stakingId"
                  name="stakingId"
                  value={stakingId}
                  onChange={handleStakingSelect}
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-1.5 text-xs border border-gray-300 rounded-md"
                >
                  <option value="">-- Select completed staking --</option>
                  {completedStakings.map(staking => (
                    <option key={staking._id} value={staking._id}>
                      {staking.packageType === 'custom' ? 'Custom' : `$${staking.packageType}`} - 
                      Profit: ${staking.profitsEarned.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-xs font-medium text-gray-700">
                  Amount (USDT)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  min="1"
                  max={maxAmount}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  disabled={!stakingId}
                  className="mt-1 block w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md"
                />
                {stakingId && (
                  <p className="mt-1 text-xs text-gray-500">
                    Available: ${maxAmount.toFixed(2)} USDT
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="walletAddress" className="block text-xs font-medium text-gray-700">
                  USDT Wallet Address (TRC20)
                </label>
                <input
                  type="text"
                  id="walletAddress"
                  name="walletAddress"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md"
                  placeholder="e.g. TVQvsciicpMfDm8NXr3TWuFv4TGHKmr1Np"
                />
                {!walletAddress && (
                  <p className="mt-1 text-xs text-yellow-600">
                    Add your wallet address to withdraw
                  </p>
                )}
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-600">
                  Funds will be sent after admin approval (within 24 hours).
                </p>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !stakingId || amount <= 0 || !walletAddress}
                  className="w-full py-2 px-4 bg-primary-600 text-white text-xs font-medium rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-gray-500">You don't have any completed stakings with profits.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderReferralEarningsTab = () => (
    <div className="space-y-4">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-3 py-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900">
            Withdraw Referral Earnings
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Withdraw your earned bonuses
          </p>
        </div>
        
        <div className="px-3 py-3">
          {user && user.referralEarnings > 0 ? (
            <form onSubmit={handleSubmitReferralWithdrawal} className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-md mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-700">Available Earnings:</span>
                  <span className="text-sm font-medium text-green-600">${user.referralEarnings.toFixed(2)} USDT</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="referralWalletAddress" className="block text-xs font-medium text-gray-700">
                  USDT Wallet Address (TRC20)
                </label>
                <input
                  type="text"
                  id="referralWalletAddress"
                  name="referralWalletAddress"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md"
                  placeholder="e.g. TVQvsciicpMfDm8NXr3TWuFv4TGHKmr1Np"
                />
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-600">
                  Funds will be sent after admin approval.
                </p>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !walletAddress}
                  className="w-full py-2 px-4 bg-primary-600 text-white text-xs font-medium rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-gray-500 mb-3">You don't have any referral earnings to withdraw.</p>
              <Link to="/referral" className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-md">
                Invite Friends to Earn
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderWithdrawalHistory = () => (
    <div className="mt-4 bg-white shadow-sm rounded-lg">
      <div className="px-3 py-3 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            Withdrawal History
          </h3>
          <p className="text-xs text-gray-500">
            View your withdrawal requests
          </p>
        </div>
        <button 
          onClick={() => setHistoryVisible(!historyVisible)}
          className="text-xs text-primary-600 font-medium"
        >
          {historyVisible ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {historyVisible && (
        loading ? (
          <div className="px-3 py-3 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          </div>
        ) : withdrawHistory.length > 0 ? (
          <div className="px-3 py-2 space-y-2">
            {withdrawHistory.map((withdrawal) => (
              <div key={withdrawal._id} className="bg-gray-50 p-2 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-medium">${withdrawal.amount.toFixed(2)} USDT</div>
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${getStatusBadgeClass(withdrawal.status)}`}>
                    {withdrawal.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Type: {withdrawal.type === 'StakingProfit' ? 'Staking Profit' : 'Referral Earnings'}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                  <span>{new Date(withdrawal.createdAt).toLocaleDateString()}</span>
                  <span className="font-mono text-xs truncate max-w-[120px]">
                    {`${withdrawal.walletAddress.substring(0, 6)}...${withdrawal.walletAddress.substring(withdrawal.walletAddress.length - 6)}`}
                  </span>
                </div>
                {withdrawal.status === 'Rejected' && withdrawal.rejectionReason && (
                  <div className="mt-1 text-xs text-red-600">
                    Reason: {withdrawal.rejectionReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="px-3 py-4 text-center text-xs text-gray-500">
            You don't have any withdrawal history yet.
          </div>
        )
      )}
    </div>
  );

  return (
    <div className="pb-16"> {/* Bottom padding for mobile navigation */}
      <TabNavigation />
      
      {activeTab === 'staking' ? renderStakingProfitTab() : renderReferralEarningsTab()}
      
      {renderWithdrawalHistory()}

      <WithdrawModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmWithdrawal}
        amount={withdrawalData?.amount}
        walletAddress={useProfileWallet ? user?.walletAddress : walletAddress}
        useProfileWallet={useProfileWallet}
        onWalletChange={setWalletAddress}
        onUseProfileWallet={(e) => setUseProfileWallet(e.target.checked)}
      />
    </div>
  );
};

export default MobileWithdrawPage;
