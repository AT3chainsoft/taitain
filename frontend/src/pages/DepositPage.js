import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';  // Fixed import path
import { toast } from 'react-toastify';
import QRCode from 'react-qr-code';

const DepositPage = () => {
  const [amount, setAmount] = useState(100);
  const [transactionId, setTransactionId] = useState('');
  const [senderWalletAddress, setSenderWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [depositHistory, setDepositHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletAddresses, setWalletAddresses] = useState({});
  const [selectedNetwork, setSelectedNetwork] = useState('usdt_trc20');
  
  // Remove unused user import since it's not being used
  // const { user } = useAuth();

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
      const response = await axios.get('/api/deposits/my-deposits'); // Changed from /user to /my-deposits
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

      // Clear form and refresh history
      setTransactionId('');
      setSenderWalletAddress('');
      fetchDepositHistory(); // Refresh deposit history after successful submission
    } catch (error) {
      console.error('Deposit error:', error);
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

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Deposit USDT/USDC
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Send USDT or USDC to our wallet address and submit the transaction details for verification.
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium text-gray-900">Step 1: Select Network and Send</h4>
                
                {/* Network selection */}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Token and Network
                  </label>
                  <select
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className="form-select mt-1 block w-full"
                  >
                    <option value="usdt_trc20">USDT (TRC20)</option>
                    <option value="usdt_polygon">USDT (Polygon)</option>
                    <option value="usdc_trc20">USDC (TRC20)</option>
                    <option value="usdc_polygon">USDC (Polygon)</option>
                  </select>
                </div>
                
                <div className="mt-3 bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm break-all">
                      {walletAddresses[selectedNetwork] || 'Address not configured yet'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(walletAddresses[selectedNetwork] || '');
                        toast.info('Wallet address copied to clipboard!');
                      }}
                      disabled={!walletAddresses[selectedNetwork]}
                      className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      Copy
                    </button>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    {walletAddresses[selectedNetwork] ? (
                      <div className="p-2 bg-white rounded">
                        <QRCode value={walletAddresses[selectedNetwork]} size={150} />
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No address configured for this network
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-gray-900">Step 2: Submit Transaction Details</h4>
                <form onSubmit={handleSubmit} className="mt-3 space-y-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Amount (USDT)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      min="10"
                      step="1"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      required
                      className="form-input mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="senderWalletAddress" className="block text-sm font-medium text-gray-700">
                      Your Sender Wallet Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="senderWalletAddress"
                      value={senderWalletAddress}
                      onChange={(e) => setSenderWalletAddress(e.target.value)}
                      required
                      placeholder="Enter the wallet address you're sending from"
                      className="mt-1 form-input block w-full rounded-md"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      This should be the wallet address you're using to send the payment
                    </p>
                  </div>

                  <div>
                    <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">
                      Transaction ID / Hash (Optional)
                    </label>
                    <input
                      type="text"
                      id="transactionId"
                      name="transactionId"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="form-input mt-1"
                      placeholder="e.g. 0x1234..."
                    />
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'I have sent the payment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-base font-medium text-gray-900">Important Notes</h4>
              <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                <li>Only send USDT using the TRC20 network.</li>
                <li>Minimum deposit amount is 10 USDT.</li>
                <li>Your deposit will be credited to your account after admin verification (usually within 24 hours).</li>
                <li>Always save your transaction ID for reference.</li>
                <li>Contact support if your deposit is not credited within 24 hours.</li>
              </ul>
              
              <div className="mt-6 bg-yellow-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Attention</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Double check the wallet address before sending funds. We are not responsible for funds sent to incorrect addresses.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Deposit History
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            View all your deposit requests and their status.
          </p>
        </div>
        
        {loading ? (
          <div className="px-4 py-5 sm:p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : depositHistory.length > 0 ? (
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
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {depositHistory.map((deposit) => (
                  <tr key={deposit._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(deposit.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${deposit.amount.toFixed(2)} USDT
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {deposit.transactionId || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(deposit.status)}`}>
                        {deposit.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
            You don't have any deposit history yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositPage;
