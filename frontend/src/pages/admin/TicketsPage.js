import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/20/solid';

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: ''
  });

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await axios.get(`/api/tickets?${queryParams.toString()}`);
      setTickets(response.data.data);
    } catch (error) {
      toast.error('Failed to load tickets');
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/tickets/stats');
      if (response && response.data && response.data.data) {
        setStats(response.data.data);
      } else {
        // If response doesn't have expected structure, use default stats
        console.warn('Stats response missing data structure:', response);
        setStats({
          total: 0,
          new: 0, open: 0, pending: 0, resolved: 0, closed: 0,
          urgent: 0, high: 0, medium: 0, low: 0,
          unassigned: 0, unread: 0,
          deposit: 0, withdrawal: 0, staking: 0, account: 0, 
          referral: 0, technical: 0, other: 0,
          averageRating: { average: 0, count: 0 }
        });
      }
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
      // Set default stats on error
      setStats({
        total: 0,
        new: 0, open: 0, pending: 0, resolved: 0, closed: 0,
        urgent: 0, high: 0, medium: 0, low: 0,
        unassigned: 0, unread: 0,
        deposit: 0, withdrawal: 0, staking: 0, account: 0, 
        referral: 0, technical: 0, other: 0,
        averageRating: { average: 0, count: 0 }
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      new: { color: 'bg-blue-100 text-blue-800', label: 'New' },
      open: { color: 'bg-green-100 text-green-800', label: 'Open' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      resolved: { color: 'bg-purple-100 text-purple-800', label: 'Resolved' },
      closed: { color: 'bg-gray-100 text-gray-800', label: 'Closed' }
    };

    const { color, label } = statusMap[status] || statusMap.new;
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      low: { color: 'bg-gray-100 text-gray-800', label: 'Low' },
      medium: { color: 'bg-blue-100 text-blue-800', label: 'Medium' },
      high: { color: 'bg-orange-100 text-orange-800', label: 'High' },
      urgent: { color: 'bg-red-100 text-red-800', label: 'Urgent' },
    };

    const { color, label } = priorityMap[priority] || priorityMap.medium;
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">Ticket Management</h1>
          <p className="mt-1 text-gray-500">Manage customer support tickets</p>
          
          {/* Stats cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total || 0}</dd>
              <div className="mt-2 text-xs text-gray-700">
                <span>Unread: {stats.unread || 0}</span>
              </div>
            </div>

            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Pending Action</dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-600">{(stats.new || 0) + (stats.open || 0)}</dd>
              <div className="mt-2 text-xs text-gray-700">
                <span>New: {stats.new || 0}</span>
                <span className="ml-2">Open: {stats.open || 0}</span>
              </div>
            </div>

            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Priority Distribution</dt>
              <dd className="mt-1 text-xl font-semibold text-red-600">
                {stats.urgent || 0} urgent
              </dd>
              <div className="mt-2 text-xs text-gray-700 space-x-2">
                <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded-full">
                  Urgent: {stats.urgent || 0}
                </span>
                <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                  High: {stats.high || 0}
                </span>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Medium: {stats.medium || 0}
                </span>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                  Low: {stats.low || 0}
                </span>
              </div>
            </div>

            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Customer Satisfaction</dt>
              {stats.averageRating ? (
                <>
                  <dd className="mt-1 flex items-center">
                    <span className="text-2xl font-semibold text-gray-900 mr-1">
                      {stats.averageRating.average}
                    </span>
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <StarSolidIcon 
                          key={star} 
                          className={`h-5 w-5 ${
                            star < Math.floor(stats.averageRating.average)
                              ? 'text-yellow-400' 
                              : star < stats.averageRating.average
                              ? 'text-yellow-300'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </dd>
                  <div className="mt-2 text-xs text-gray-700">
                    Based on {stats.averageRating.count} reviews
                  </div>
                </>
              ) : (
                <dd className="mt-1 text-xl font-semibold text-gray-500">No reviews yet</dd>
              )}
            </div>
          </div>
          
          {/* Category Stats */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Ticket Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {['deposit', 'withdrawal', 'staking', 'account', 'referral', 'technical', 'other'].map((category) => (
                <div 
                  key={category}
                  className="bg-white p-3 rounded-lg shadow border border-gray-100 text-center"
                  onClick={() => setFilters({...filters, category})}
                >
                  <h4 className="text-sm font-medium text-gray-500 capitalize">{category}</h4>
                  <p className="text-2xl font-semibold text-gray-900">{stats[category] || 0}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Support Tickets</h2>
        </div>
        
        {/* Filters */}
        <div className="bg-gray-50 px-4 py-4 border-b border-gray-200 sm:px-6">
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search tickets"
              />
            </div>
            
            <div>
              <select
                id="status-filter"
                name="status"
                className="form-select block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div>
              <select
                id="category-filter"
                name="category"
                className="form-select block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="staking">Staking</option>
                <option value="account">Account</option>
                <option value="referral">Referral</option>
                <option value="technical">Technical</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <select
                id="priority-filter"
                name="priority"
                className="form-select block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={filters.priority}
                onChange={handleFilterChange}
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div>
              <button
                type="button"
                onClick={() => setFilters({ status: '', category: '', priority: '', search: '' })}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <AdjustmentsHorizontalIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="px-4 py-10 sm:px-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-gray-500">Loading tickets...</p>
          </div>
        ) : tickets.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <li key={ticket._id}>
                <Link 
                  to={`/admin/tickets/${ticket._id}`}
                  className="block hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${ticket.isRead ? 'bg-gray-100' : 'bg-primary-100'} flex items-center justify-center`}>
                          <ChatBubbleLeftRightIcon 
                            className={`h-6 w-6 ${ticket.isRead ? 'text-gray-500' : 'text-primary-600'}`}
                            aria-hidden="true" 
                          />
                        </div>
                        <div className="ml-4">
                          <p className={`text-sm font-medium ${ticket.isRead ? 'text-gray-900' : 'text-primary-700 font-semibold'}`}>
                            {ticket.subject}
                            {!ticket.isRead && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                New
                              </span>
                            )}
                          </p>
                          <div className="text-sm text-gray-500">
                            <span>From: {ticket.userId?.email || 'Unknown User'}</span>
                            <span className="mx-1">•</span>
                            <span>Category: {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex space-x-2">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <div className="mt-2 text-sm text-gray-500 flex items-center">
                          <ClockIcon className="mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                          <time dateTime={ticket.lastUpdated}>
                            {formatDate(ticket.lastUpdated)}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-10 sm:px-6 text-center">
            <ChatBubbleLeftRightIcon className="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No support tickets match your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
