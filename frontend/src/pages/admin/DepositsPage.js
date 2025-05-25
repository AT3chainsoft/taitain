import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { 
  MagnifyingGlassIcon as SearchIcon, 
  CheckIcon, 
  XMarkIcon as XIcon 
} from '@heroicons/react/24/outline';

const DepositsPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [processingId, setProcessingId] = useState(null);

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
          (deposit.transactionId && deposit.transactionId.toLowerCase().includes(searchLower))
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
      console.log('Admin deposits:', response.data); // Debug log
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
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Deposits Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and manage user deposit requests.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <div className="relative rounded-md shadow-sm max-w-xs w-full">
              <input
                type="text"
                placeholder="Search deposits..."
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
              <option value="Confirmed">Confirmed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
            </div>
          ) : filteredDeposits.length > 0 ? (
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
                    Transaction ID
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
                {filteredDeposits.map(deposit => (
                  <tr key={deposit._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {deposit.userId?.email || 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {deposit.userId?._id || deposit.userId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${deposit.amount.toFixed(2)} USDT
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {deposit.transactionId || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(deposit.status)}`}>
                        {deposit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(deposit.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {deposit.status === 'Pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(deposit._id)}
                            disabled={processingId === deposit._id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleReject(deposit._id)}
                            disabled={processingId === deposit._id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            <XIcon className="h-5 w-5" />
                          </button>
                          {processingId === deposit._id && (
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
              No deposits found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositsPage;
