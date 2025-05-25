import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import {
  ChatBubbleLeftRightIcon,
  PlusCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const MobileSupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' or 'new'
  const navigate = useNavigate();

  // New ticket form states
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('other');
  const [priority, setPriority] = useState('medium');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets();
    }
  }, [statusFilter, activeTab]);

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

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast.error('Please provide a subject and message');
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post('/api/tickets', {
        subject,
        category,
        priority,
        message
      });

      if (response.data.success) {
        toast.success('Support ticket created successfully!');
        // Clear form
        setSubject('');
        setCategory('other');
        setPriority('medium');
        setMessage('');
        // Switch back to tickets tab and refresh
        setActiveTab('tickets');
        fetchTickets();
      }
    } catch (error) {
      toast.error('Failed to create support ticket');
      console.error('Error creating ticket:', error);
    } finally {
      setSubmitting(false);
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
      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
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
      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Tab navigation component
  const TabNavigation = () => (
    <div className="flex border-b border-gray-200 mb-4">
      <button
        className={`py-2 px-4 text-sm font-medium flex items-center ${
          activeTab === 'tickets'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('tickets')}
      >
        <EnvelopeIcon className="h-4 w-4 mr-1.5" />
        My Tickets
      </button>
      <button
        className={`py-2 px-4 text-sm font-medium flex items-center ${
          activeTab === 'new'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('new')}
      >
        <PlusCircleIcon className="h-4 w-4 mr-1.5" />
        New Ticket
      </button>
    </div>
  );

  // Tickets list tab
  const TicketsTab = () => (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-medium text-gray-900">
            Support Tickets
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            View and manage your requests
          </p>
        </div>
        <button
          onClick={() => setActiveTab('new')}
          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-primary-600"
        >
          <PlusCircleIcon className="-ml-1 mr-1.5 h-4 w-4" aria-hidden="true" />
          New
        </button>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <select
          id="status-filter"
          name="status"
          className="form-select block w-full py-1.5 px-3 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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

      {loading ? (
        <div className="px-4 py-6 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      ) : tickets.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {tickets.map((ticket) => (
            <div 
              key={ticket._id}
              className="block hover:bg-gray-50 transition-colors duration-150"
              onClick={() => navigate(`/support/${ticket._id}`)}
            >
              <div className="px-4 py-3">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full ${ticket.userRead ? 'bg-gray-100' : 'bg-primary-100'} flex items-center justify-center`}>
                    <ChatBubbleLeftRightIcon 
                      className={`h-4 w-4 ${ticket.userRead ? 'text-gray-500' : 'text-primary-600'}`}
                      aria-hidden="true" 
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className={`text-sm font-medium ${ticket.userRead ? 'text-gray-900' : 'text-primary-700'} truncate max-w-[200px]`}>
                        {ticket.subject}
                        {!ticket.userRead && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            New
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)} • 
                      {ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 flex flex-wrap justify-between items-center">
                  <div className="flex space-x-1 mb-1">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <ClockIcon className="mr-1 h-3 w-3 text-gray-400" aria-hidden="true" />
                    {formatDate(ticket.lastUpdated)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-6 text-center">
          <ChatBubbleLeftRightIcon className="mx-auto h-8 w-8 text-gray-400" aria-hidden="true" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
          <p className="mt-1 text-xs text-gray-500">
            {statusFilter !== 'all' 
              ? `You don't have any ${statusFilter} tickets.`
              : 'Get started by creating a new support ticket.'}
          </p>
          <div className="mt-4">
            <button
              onClick={() => setActiveTab('new')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary-600"
            >
              <PlusCircleIcon className="-ml-1 mr-1.5 h-4 w-4" aria-hidden="true" />
              Create New Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // New ticket form tab
  const NewTicketTab = () => (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-lg font-medium text-gray-900">
          Create Support Ticket
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Our team will respond as soon as possible
        </p>
      </div>
      
      <form className="px-4 py-4" onSubmit={handleCreateTicket}>
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="subject" 
              className="block text-xs font-medium text-gray-700"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <div>
            <label 
              htmlFor="category" 
              className="block text-xs font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="staking">Staking</option>
              <option value="account">Account</option>
              <option value="referral">Referral Program</option>
              <option value="technical">Technical Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label 
              htmlFor="priority" 
              className="block text-xs font-medium text-gray-700"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div>
            <label 
              htmlFor="message" 
              className="block text-xs font-medium text-gray-700"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              ></textarea>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Please provide all relevant details
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-md">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400 mt-0.5" aria-hidden="true" />
              <div className="ml-2">
                <p className="text-xs text-yellow-800">
                  We typically respond within 24 hours. For urgent matters, please set the priority accordingly.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Ticket'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tickets')}
            className="flex-1 py-2 bg-white border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="space-y-4 pb-16">
      <TabNavigation />
      
      {activeTab === 'tickets' ? <TicketsTab /> : <NewTicketTab />}
      
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-sm font-medium mb-2">Contact Us</h2>
        <p className="text-xs text-gray-600">Email: support@titanstaking.com</p>
      </div>
    </div>
  );
};

export default MobileSupportPage;
