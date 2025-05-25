import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import QRCode from 'react-qr-code';

const MobileDepositPage = () => {
  const [amount, setAmount] = useState(100);
  const [transactionId, setTransactionId] = useState('');
  const [senderWalletAddress, setSenderWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [depositHistory, setDepositHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletAddresses, setWalletAddresses] = useState({});
  const [selectedNetwork, setSelectedNetwork] = useState('usdt_trc20');
  const [activeTab, setActiveTab] = useState('deposit'); // New state for tab navigation
  
  useEffect(() => {
    // Fetch wallet addresses from public endpoint
    const fetchWalletAddresses = async () => {
      try {
        const response = await axios.get('/api/settings/wallet-addresses');
        setWalletAddresses(response.data.data);
      } catch (error) {
        console.error('Error fetching wallet addresses:', error);
      }
    };

    fetchWalletAddresses();
    fetchDepositHistory();
  }, []);

  const fetchDepositHistory = async () => {
    try {
      const response = await axios.get('/api/deposits/my-deposits');
      console.log('Deposit history:', response.data);
      setDepositHistory(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deposit history:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      await axios.post('/api/deposits', {
        amount: parseFloat(amount),
        transactionId: transactionId.trim(),
        senderWalletAddress: senderWalletAddress.trim(),
        network: selectedNetwork
      });

      toast.success('Deposit request submitted successfully!');
      // Clear form and refresh history
      setTransactionId('');
      setSenderWalletAddress('');
      fetchDepositHistory();
      // Switch to history tab after successful submission
      setActiveTab('history');
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error('Failed to submit deposit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Tab navigation component
  const TabNavigation = () => (
    <div className="flex border-b border-gray-200 mb-4">
      <button
        className={`py-2 px-4 text-sm font-medium ${
          activeTab === 'deposit'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('deposit')}
      >
        Make Deposit
      </button>
      <button
        className={`py-2 px-4 text-sm font-medium ${
          activeTab === 'history'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('history')}
      >
        History
      </button>
    </div>
  );

  // Deposit form tab content
  const DepositForm = () => (
    <div className="space-y-4">
      <div className="bg-white shadow rounded-lg">
        <div className="px-3 py-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900">
            Deposit USDT/USDC
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Send USDT or USDC to our wallet address
          </p>
        </div>
        
        <div className="px-3 py-3">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Step 1: Select Network</h4>
              
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-700">
                  Select Token and Network
                </label>
                <select
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                  className="form-select mt-1 block w-full text-sm py-1.5"
                >
                  <option value="usdt_trc20">USDT (TRC20)</option>
                  <option value="usdt_polygon">USDT (Polygon)</option>
                  <option value="usdc_trc20">USDC (TRC20)</option>
                  <option value="usdc_polygon">USDC (Polygon)</option>
                </select>
              </div>
              
              <div className="mt-2 bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs break-all overflow-hidden">
                    {walletAddresses[selectedNetwork] 
                      ? walletAddresses[selectedNetwork].substring(0, 20) + '...'
                      : 'Address not configured'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(walletAddresses[selectedNetwork] || '');
                      toast.info('Address copied!');
                    }}
                    disabled={!walletAddresses[selectedNetwork]}
                    className="ml-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100"
                  >
                    Copy
                  </button>
                </div>
                
                <div className="mt-3 flex justify-center">
                  {walletAddresses[selectedNetwork] ? (
                    <div className="p-2 bg-white rounded">
                      <QRCode value={walletAddresses[selectedNetwork]} size={100} />
                    </div>
                  ) : (
                    <div className="p-3 text-center text-xs text-gray-500">
                      No address configured
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900">Step 2: Submit Details</h4>
              <form onSubmit={handleSubmit} className="mt-2 space-y-3">
                <div>
                  <label htmlFor="amount" className="block text-xs font-medium text-gray-700">
                    Amount (USDT)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    min="10"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    className="form-input mt-1 text-sm py-1.5 w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="senderWalletAddress" className="block text-xs font-medium text-gray-700">
                    Your Sender Wallet Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="senderWalletAddress"
                    value={senderWalletAddress}
                    onChange={(e) => setSenderWalletAddress(e.target.value)}
                    required
                    placeholder="Your sending wallet address"
                    className="mt-1 form-input block w-full text-sm py-1.5"
                  />
                </div>

                <div>
                  <label htmlFor="transactionId" className="block text-xs font-medium text-gray-700">
                    Transaction ID / Hash (Optional)
                  </label>
                  <input
                    type="text"
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="form-input mt-1 text-sm py-1.5 w-full"
                    placeholder="e.g. 0x1234..."
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'I have sent the payment'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <h3 className="text-xs font-medium text-yellow-800">Important</h3>
                  <div className="mt-1 text-xs text-yellow-700">
                    <p>Double check the wallet address before sending funds.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-gray-900">Notes</h4>
              <ul className="mt-1 space-y-1 text-xs text-gray-600 list-disc pl-4">
                <li>Minimum deposit: 10 USDT</li>
                <li>Processing time: up to 24 hours</li>
                <li>Save your transaction ID</li>
                <li>Contact support for issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // History tab content
  const DepositHistory = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-3 py-3 border-b border-gray-200">
        <h3 className="text-base font-medium text-gray-900">
          Deposit History
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Your deposit requests and their status
        </p>
      </div>
      
      {loading ? (
        <div className="px-3 py-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : depositHistory.length > 0 ? (
        <div className="px-2 py-2">
          {depositHistory.map((deposit) => (
            <div key={deposit._id} className="border-b border-gray-100 py-2">
              <div className="flex justify-between items-center">
                <div className="text-xs font-medium">${deposit.amount.toFixed(2)} USDT</div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadgeClass(deposit.status)}`}>
                  {deposit.status}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(deposit.createdAt).toLocaleDateString()} {new Date(deposit.createdAt).toLocaleTimeString()}
              </div>
              {deposit.transactionId && (
                <div className="text-xs font-mono text-gray-500 mt-1 truncate">
                  TX: {deposit.transactionId.substring(0, 16)}...
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="px-3 py-4 text-center text-xs text-gray-500">
          You don't have any deposit history yet.
        </div>
      )}
    </div>
  );

  return (
    <div className="pb-16"> {/* Added padding at bottom for mobile navigation */}
      <TabNavigation />
      
      {activeTab === 'deposit' ? <DepositForm /> : <DepositHistory />}
    </div>
  );
};

export default MobileDepositPage;
