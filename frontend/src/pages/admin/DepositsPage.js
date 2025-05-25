import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { 
  MagnifyingGlassIcon as SearchIcon, 
  CheckIcon, 
  XMarkIcon as XIcon,
  EyeIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const DepositsPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(null);

  useEffect(() => {
    fetchDeposits();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...deposits];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(deposit => deposit.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(deposit => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (deposit.userId?.email && deposit.userId.email.toLowerCase().includes(searchLower)) ||
          (deposit.transactionId && deposit.transactionId.toLowerCase().includes(searchLower)) ||
          (deposit.senderWalletAddress && deposit.senderWalletAddress.toLowerCase().includes(searchLower))
        );
      });
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredDeposits(filtered);
  }, [deposits, searchTerm, statusFilter]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/deposits/all');
      setDeposits(response.data.data);
      setFilteredDeposits(response.data.data);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      toast.error('Failed to fetch deposits');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      await axios.put(`/api/deposits/${id}/approve`);
      toast.success('Deposit approved successfully');
      
      // Update local state
      setDeposits(deposits.map(deposit => {
        if (deposit._id === id) {
          return { ...deposit, status: 'Confirmed' };
        }
        return deposit;
      }));
    } catch (error) {
      toast.error('Failed to approve deposit');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setProcessingId(id);
      await axios.put(`/api/deposits/${id}/reject`);
      toast.success('Deposit rejected successfully');
      
      // Update local state
      setDeposits(deposits.map(deposit => {
        if (deposit._id === id) {
          return { ...deposit, status: 'Rejected' };
        }
        return deposit;
      }));
    } catch (error) {
      toast.error('Failed to reject deposit');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getNetworkLabel = (network) => {
    switch (network) {
      case 'usdt_trc20':
        return 'USDT (TRC20)';
      case 'usdt_polygon':
        return 'USDT (Polygon)';
      case 'usdc_trc20':
        return 'USDC (TRC20)';
      case 'usdc_polygon':
        return 'USDC (Polygon)';
      default:
        return network || 'Unknown';
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(id);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                Deposits Management
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review and manage deposits
              </p>
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center md:mt-0 md:ml-4 space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="relative rounded-md shadow-sm max-w-xs w-full">
                <input
                  type="text"
                  placeholder="Search by email, txid, wallet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input block w-full pr-10 sm:text-sm sm:leading-5 rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm sm:leading-5 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredDeposits.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender Wallet
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Network
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeposits.map(deposit => (
                  <tr key={deposit._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${deposit.amount?.toFixed(2) || '0.00'} USDT
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 font-mono">
                          {truncateAddress(deposit.senderWalletAddress)}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(deposit.senderWalletAddress, deposit._id)}
                          className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                          title="Copy wallet address"
                        >
                          {copiedAddress === deposit._id ? (
                            <span className="text-xs text-green-600">Copied!</span>
                          ) : (
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getNetworkLabel(deposit.network)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono max-w-[150px] truncate" title={deposit.transactionId || ''}>
                        {deposit.transactionId || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeClass(deposit.status)}`}>
                        {deposit.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(deposit.createdAt)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <Link 
                          to={`/admin/deposits/${deposit._id}`}
                          className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>

                        {deposit.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(deposit._id)}
                              disabled={processingId === deposit._id}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md flex items-center text-sm font-medium transition-colors duration-150 disabled:opacity-50 w-full sm:w-auto justify-center"
                              title="Approve Deposit"
                            >
                              <CheckIcon className="h-5 w-5 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(deposit._id)}
                              disabled={processingId === deposit._id}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center text-sm font-medium transition-colors duration-150 disabled:opacity-50 w-full sm:w-auto justify-center"
                              title="Reject Deposit"
                            >
                              <XIcon className="h-5 w-5 mr-1" />
                              Reject
                            </button>
                            {processingId === deposit._id && (
                              <div className="animate-spin h-4 w-4 border-b-2 border-primary-500 rounded-full"></div>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-sm font-medium">No deposits found matching your criteria</p>
              <p className="mt-1 text-xs text-gray-400">Try changing your search or filter settings</p>
            </div>
          )}
        </div>

        <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <p>Total deposits: {filteredDeposits.length} (of {deposits.length})</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositsPage;
