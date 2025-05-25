import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline';

const StakingsPage = () => {
  const [stakings, setStakings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredStakings, setFilteredStakings] = useState([]);

  useEffect(() => {
    fetchStakings();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...stakings];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(staking => staking.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(staking => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (staking.userId?.email && staking.userId.email.toLowerCase().includes(searchLower)) ||
          (staking.packageType && staking.packageType.toLowerCase().includes(searchLower))
        );
      });
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredStakings(filtered);
  }, [stakings, searchTerm, statusFilter]);

  const fetchStakings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/staking/all');
      setStakings(response.data.data);
      setFilteredStakings(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch stakings');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateRemainingDays = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const remaining = end - now;
    return Math.max(0, Math.floor(remaining / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Stakings Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View and monitor all staking packages in the system.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <div className="relative rounded-md shadow-sm max-w-xs w-full">
              <input
                type="text"
                placeholder="Search stakings..."
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
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
            </div>
          ) : filteredStakings.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weekly Return
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Earned
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start / End Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStakings.map(staking => {
                  const remainingDays = calculateRemainingDays(staking.endDate);
                  
                  return (
                    <tr key={staking._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {staking.userId?.email || 'Unknown User'}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {staking.userId?._id || staking.userId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {staking.packageType === 'custom' ? 'Custom Package' : `$${staking.packageType} Package`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${staking.amount.toFixed(2)} USDT
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staking.weeklyReturnPercent}% (${(staking.amount * staking.weeklyReturnPercent / 100).toFixed(2)})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-600 font-medium">
                          ${staking.profitsEarned.toFixed(2)} USDT
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staking.lockPeriod} {staking.lockPeriod === 1 ? 'month' : 'months'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(staking.status)}`}>
                          {staking.status}
                          {staking.status === 'Active' && remainingDays > 0 && ` (${remainingDays} days left)`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        <div>Start: {formatDate(staking.startDate)}</div>
                        <div>End: {formatDate(staking.endDate)}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-gray-500">
              No stakings found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StakingsPage;
