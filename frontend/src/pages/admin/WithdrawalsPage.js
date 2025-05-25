import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { 
  MagnifyingGlassIcon as SearchIcon, 
  CheckIcon, 
  XMarkIcon as XIcon 
} from '@heroicons/react/24/outline';

const WithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedApprovalWithdrawal, setSelectedApprovalWithdrawal] = useState(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...withdrawals];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(withdrawal => withdrawal.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(withdrawal => withdrawal.type === typeFilter);
    }
    
    // Apply search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(withdrawal => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (withdrawal.userId?.email && withdrawal.userId.email.toLowerCase().includes(searchLower)) ||
          (withdrawal.walletAddress && withdrawal.walletAddress.toLowerCase().includes(searchLower))
        );
      });
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredWithdrawals(filtered);
  }, [withdrawals, searchTerm, statusFilter, typeFilter]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/withdrawals/all');
      setWithdrawals(response.data.data);
      setFilteredWithdrawals(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch withdrawals');
      setLoading(false);
    }
  };

  const handleApprove = async (id, { transactionUrl, adminComment }) => {
    try {
      setProcessingId(id);
      await axios.put(`/api/withdrawals/${id}/approve`, {
        transactionUrl,
        adminComment
      });
      
      toast.success('Withdrawal approved successfully');
      
      setWithdrawals(withdrawals.map(withdrawal => {
        if (withdrawal._id === id) {
          return {
            ...withdrawal,
            status: 'Approved',
            transactionUrl,
            adminComment
          };
        }
        return withdrawal;
      }));
      
      setShowApprovalModal(false);
    } catch (error) {
      toast.error('Failed to approve withdrawal');
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectionModal = (id) => {
    setSelectedWithdrawalId(id);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const handleReject = async () => {
    try {
      setProcessingId(selectedWithdrawalId);
      const response = await axios.put(`/api/withdrawals/${selectedWithdrawalId}/reject`, { 
        rejectionReason: rejectionReason.trim() || 'Rejected by admin' 
      });
      
      if (response.data.success) {
        toast.success('Withdrawal rejected and balance restored');
        
        // Update local state
        setWithdrawals(withdrawals.map(withdrawal => {
          if (withdrawal._id === selectedWithdrawalId) {
            return { 
              ...withdrawal, 
              status: 'Rejected',
              rejectionReason: rejectionReason.trim() || 'Rejected by admin'
            };
          }
          return withdrawal;
        }));
        
        setShowRejectionModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject withdrawal');
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
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'StakingProfit':
        return 'bg-blue-100 text-blue-800';
      case 'ReferralEarnings':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Wallet address copied to clipboard!'))
      .catch(() => toast.error('Failed to copy address'));
  };

  const openApprovalModal = (withdrawal) => {
    setSelectedApprovalWithdrawal(withdrawal);
    setShowApprovalModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Withdrawals Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and manage user withdrawal requests.
            </p>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row md:mt-0 md:ml-4 space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative rounded-md shadow-sm max-w-xs w-full">
              <input
                type="text"
                placeholder="Search withdrawals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input block w-full pr-10 sm:text-sm sm:leading-5"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm sm:leading-5 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="form-select block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm sm:leading-5 rounded-md"
            >
              <option value="all">All Types</option>
              <option value="StakingProfit">Staking Profit</option>
              <option value="ReferralEarnings">Referral Earnings</option>
            </select>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
            </div>
          ) : filteredWithdrawals.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWithdrawals.map(withdrawal => (
                  <tr key={withdrawal._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {withdrawal.userId?.email || 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {withdrawal.userId?._id || withdrawal.userId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${withdrawal.amount.toFixed(2)} USDT
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(withdrawal.type)}`}>
                        {withdrawal.type === 'StakingProfit' ? 'Staking Profit' : 'Referral Earnings'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono flex items-center">
                        <span className="truncate max-w-xs">
                          {withdrawal.walletAddress}
                        </span>
                        <button
                          onClick={() => copyToClipboard(withdrawal.walletAddress)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          title="Copy wallet address"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                      {withdrawal.rejectionReason && (
                        <div className="text-xs text-red-600 mt-1">
                          {withdrawal.rejectionReason}
                        </div>
                      )}
                      {withdrawal.transactionUrl && (
                        <div className="text-xs text-gray-500 mt-1">
                          <a 
                            href={withdrawal.transactionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700"
                          >
                            View Transaction
                          </a>
                          {withdrawal.adminComment && (
                            <p className="text-gray-500 mt-1">{withdrawal.adminComment}</p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(withdrawal.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {withdrawal.status === 'Pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openApprovalModal(withdrawal)}
                            disabled={processingId === withdrawal._id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Approve Withdrawal"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openRejectionModal(withdrawal._id)}
                            disabled={processingId === withdrawal._id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Reject Withdrawal"
                          >
                            <XIcon className="h-5 w-5" />
                          </button>
                          {processingId === withdrawal._id && (
                            <div className="ml-2 animate-spin h-4 w-4 border-b-2 border-secondary-500 rounded-full"></div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-gray-500">
              No withdrawals found matching your search criteria.
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <XIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Reject Withdrawal
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please provide a reason for rejecting this withdrawal request:
                      </p>
                      <textarea
                        className="mt-2 form-textarea block w-full rounded-md shadow-sm"
                        rows="3"
                        placeholder="Reason for rejection (optional)"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button"
                  onClick={handleReject}
                  disabled={processingId}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {processingId ? 'Processing...' : 'Reject'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowRejectionModal(false)}
                  disabled={processingId}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <ApprovalModal
          isOpen={showApprovalModal}
          onClose={() => setShowApprovalModal(false)}
          onConfirm={handleApprove}
          withdrawal={selectedApprovalWithdrawal}
          isProcessing={processingId === selectedApprovalWithdrawal._id}
        />
      )}
    </div>
  );
};

const ApprovalModal = ({ isOpen, onClose, onConfirm, withdrawal, isProcessing }) => {
  const [transactionUrl, setTransactionUrl] = useState('');
  const [adminComment, setAdminComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(withdrawal._id, { transactionUrl, adminComment });
  };

  return (
    <div className={`fixed z-10 inset-0 overflow-y-auto ${isOpen ? '' : 'hidden'}`}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Approve Withdrawal
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Transaction URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={transactionUrl}
                        onChange={(e) => setTransactionUrl(e.target.value)}
                        placeholder="https://tronscan.org/..."
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Admin Comment
                      </label>
                      <textarea
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Add any notes about this transaction..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Confirm Approval'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalsPage;
