import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import {
  ChatBubbleLeftRightIcon,
  PlusCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' 
        ? '/api/tickets' 
        : `/api/tickets?status=${statusFilter}`;
      
      const response = await axios.get(url);
      setTickets(response.data.data);
    } catch (error) {
      toast.error('Failed to load tickets');
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-lg leading-6 font-medium text-gray-900">
              Support Tickets
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your support requests
            </p>
          </div>
          <Link
            to="/support/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Ticket
          </Link>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="sm:flex-grow">
              <label htmlFor="status-filter" className="sr-only">
                Filter by status
              </label>
              <select
                id="status-filter"
                name="status"
                className="form-select block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Tickets</option>
                <option value="new">New</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
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
                  to={`/support/${ticket._id}`}
                  className="block hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${ticket.userRead ? 'bg-gray-100' : 'bg-primary-100'} flex items-center justify-center`}>
                          <ChatBubbleLeftRightIcon 
                            className={`h-6 w-6 ${ticket.userRead ? 'text-gray-500' : 'text-primary-600'}`}
                            aria-hidden="true" 
                          />
                        </div>
                        <div className="ml-4">
                          <p className={`text-sm font-medium ${ticket.userRead ? 'text-gray-900' : 'text-primary-700'}`}>
                            {ticket.subject}
                            {!ticket.userRead && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                New Reply
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)} • 
                            {ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}
                          </p>
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
              {statusFilter !== 'all' 
                ? `You don't have any ${statusFilter} tickets.`
                : 'Get started by creating a new support ticket.'}
            </p>
            <div className="mt-6">
              <Link
                to="/support/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Ticket
              </Link>
            </div>
          </div>
        )}
      </div>
      <p>Email: support@taitanstaking.com</p>
    </div>
  );
};

export default SupportPage;
