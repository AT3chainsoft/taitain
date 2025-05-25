import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const WithdrawModal = ({ isOpen, onClose, onConfirm, amount, walletAddress, useProfileWallet, onWalletChange, onUseProfileWallet }) => {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-black bg-opacity-50 absolute inset-0" onClick={onClose}></div>
      <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Withdrawal</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">Amount to withdraw:</p>
            <p className="text-lg font-bold text-gray-900">${amount} USDT</p>
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
              <label htmlFor="useProfileWallet" className="text-sm text-gray-700">
                Use wallet address from profile
              </label>
            </div>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => onWalletChange(e.target.value)}
              disabled={useProfileWallet}
              placeholder="Enter TRC20 wallet address"
              className="form-input w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Make sure this is a valid TRC20 wallet address</p>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!walletAddress}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
            >
              Confirm Withdrawal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WithdrawPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingCompletedStakings, setLoadingCompletedStakings] = useState(true);
  const [completedStakings, setCompletedStakings] = useState([]);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('staking');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [useProfileWallet, setUseProfileWallet] = useState(true);
  const [withdrawalData, setWithdrawalData] = useState(null);
  
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
        toast.success('Withdrawal request submitted successfully');
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

  const renderStakingProfitTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Withdraw Staking Profits
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Withdraw profits from your completed stakings.
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          {loadingCompletedStakings ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : completedStakings.length > 0 ? (
            <form onSubmit={handleSubmitStakingWithdrawal} className="space-y-4">
              <div>
                <label htmlFor="stakingId" className="block text-sm font-medium text-gray-700">
                  Select Staking
                </label>
                <select
                  id="stakingId"
                  name="stakingId"
                  value={stakingId}
                  onChange={handleStakingSelect}
                  required
                  className="form-input mt-1"
                >
                  <option value="">-- Select a completed staking --</option>
                  {completedStakings.map(staking => (
                    <option key={staking._id} value={staking._id}>
                      {staking.packageType === 'custom' ? 'Custom' : `$${staking.packageType}`} Package - 
                      Profit: ${staking.profitsEarned.toFixed(2)} USDT
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
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
                  className="form-input mt-1"
                />
                {stakingId && (
                  <p className="mt-1 text-xs text-gray-500">
                    Available: ${maxAmount.toFixed(2)} USDT
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700">
                  USDT Wallet Address (TRC20)
                </label>
                <input
                  type="text"
                  id="walletAddress"
                  name="walletAddress"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                  className="form-input mt-1"
                  placeholder="e.g. TVQvsciicpMfDm8NXr3TWuFv4TGHKmr1Np"
                />
                {!walletAddress && (
                  <p className="mt-1 text-xs text-yellow-600">
                    Please add your wallet address to withdraw funds.
                  </p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  Please review your withdrawal details carefully. Funds will be sent to your wallet after admin approval (usually within 24 hours).
                </p>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !stakingId || amount <= 0 || !walletAddress}
                  className="w-full btn-primary py-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">You don't have any completed stakings with profits to withdraw.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderReferralEarningsTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Withdraw Referral Earnings
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Withdraw your earned referral bonuses.
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          {user && user.referralEarnings > 0 ? (
            <form onSubmit={handleSubmitReferralWithdrawal} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Available Referral Earnings:</span>
                  <span className="text-lg font-medium text-green-600">${user.referralEarnings.toFixed(2)} USDT</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="referralAmount" className="block text-sm font-medium text-gray-700">
                  Amount (USDT)
                </label>
                <input
                  type="number"
                  id="referralAmount"
                  name="referralAmount"
                  min="1"
                  max={user.referralEarnings}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  className="form-input mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="referralWalletAddress" className="block text-sm font-medium text-gray-700">
                  USDT Wallet Address (TRC20)
                </label>
                <input
                  type="text"
                  id="referralWalletAddress"
                  name="referralWalletAddress"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                  className="form-input mt-1"
                  placeholder="e.g. TVQvsciicpMfDm8NXr3TWuFv4TGHKmr1Np"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  Please review your withdrawal details carefully. Funds will be sent to your wallet after admin approval.
                </p>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || amount <= 0 || amount > user.referralEarnings || !walletAddress}
                  className="w-full btn-primary py-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">You don't have any referral earnings to withdraw.</p>
              <a href="/referral" className="btn-primary">
                Invite Friends to Earn
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="form-input"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="staking">Staking Profits</option>
            <option value="referral">Referral Earnings</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('staking')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'staking'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Staking Profits
            </button>
            <button
              onClick={() => setActiveTab('referral')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'referral'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Referral Earnings
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'staking' ? renderStakingProfitTab() : renderReferralEarningsTab()}
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Withdrawal History
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            View all your withdrawal requests and their status.
          </p>
        </div>
        
        {loading ? (
          <div className="px-4 py-5 sm:p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : withdrawHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wallet Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawHistory.map((withdrawal) => (
                  <tr key={withdrawal._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(withdrawal.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${withdrawal.amount.toFixed(2)} USDT
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {withdrawal.type === 'StakingProfit' ? 'Staking Profit' : 'Referral Earnings'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {`${withdrawal.walletAddress.substring(0, 8)}...${withdrawal.walletAddress.substring(withdrawal.walletAddress.length - 8)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                      {withdrawal.status === 'Rejected' && withdrawal.rejectionReason && (
                        <span className="block mt-1 text-xs text-red-600">
                          {withdrawal.rejectionReason}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
            You don't have any withdrawal history yet.
          </div>
        )}
      </div>

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

export default WithdrawPage;
