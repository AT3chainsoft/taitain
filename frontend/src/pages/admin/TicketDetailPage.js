import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { 
  ChevronLeftIcon, 
  PaperAirplaneIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  UserIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/20/solid';

const AdminTicketDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [updating, setUpdating] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTicket();
    fetchAdmins();
  }, [id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/tickets/${id}`);
      setTicket(response.data.data);
    } catch (error) {
      toast.error('Failed to load ticket details');
      console.error('Error fetching ticket:', error);
      navigate('/admin/tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('/api/users?role=admin');
      setAdmins(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setSending(true);
      const response = await axios.post(`/api/tickets/${id}/replies`, { message });
      
      if (response.data.success) {
        setTicket(response.data.data);
        setMessage('');
        toast.success('Reply sent successfully');
      }
    } catch (error) {
      toast.error('Failed to send reply');
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      setUpdating(true);
      const response = await axios.put(`/api/tickets/${id}/status`, { status });
      
      if (response.data.success) {
        setTicket(response.data.data);
        toast.success(`Ticket status updated to ${status}`);
      }
    } catch (error) {
      toast.error('Failed to update ticket status');
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePriority = async (priority) => {
    try {
      setUpdating(true);
      const response = await axios.put(`/api/tickets/${id}/priority`, { priority });
      
      if (response.data.success) {
        setTicket(response.data.data);
        toast.success(`Priority updated to ${priority}`);
      }
    } catch (error) {
      toast.error('Failed to update priority');
      console.error('Error updating priority:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignTicket = async (adminId) => {
    try {
      setUpdating(true);
      const response = await axios.put(`/api/tickets/${id}/assign`, { adminId });
      
      if (response.data.success) {
        setTicket(response.data.data);
        toast.success('Ticket assigned successfully');
      }
    } catch (error) {
      toast.error('Failed to assign ticket');
      console.error('Error assigning ticket:', error);
    } finally {
      setUpdating(false);
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
      urgent: { color: 'bg-red-100 text-red-800', label: 'Urgent' }
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-sm text-gray-500">Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Ticket not found</p>
        <Link to="/admin/tickets" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-800">
          <ChevronLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          Back to All Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/admin/tickets" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800">
          <ChevronLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          Back to All Tickets
        </Link>
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdateStatus('closed')}
            disabled={updating || ticket.status === 'closed'}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XMarkIcon className="-ml-1 mr-1 h-4 w-4 text-gray-600" aria-hidden="true" />
            Close
          </button>
          <button
            onClick={() => handleUpdateStatus('resolved')}
            disabled={updating || ticket.status === 'resolved'}
            className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
            Resolve
          </button>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-lg leading-6 font-medium text-gray-900">
                {ticket.subject}
              </h1>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <UserIcon className="mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                <p>From: {ticket.userId?.email || 'Unknown User'}</p>
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <ClockIcon className="mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                <p>Created: <time dateTime={ticket.createdAt}>{formatDate(ticket.createdAt)}</time></p>
              </div>
            </div>
            <div className="flex flex-col sm:items-end gap-2">
              {/* Status dropdown */}
              <div className="inline-flex items-center">
                <span className="text-sm text-gray-500 mr-2">Status:</span>
                <select
                  value={ticket.status}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  disabled={updating}
                  className="form-select block w-full pl-3 pr-10 py-1 text-base leading-6 border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="new">New</option>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              {/* Priority dropdown */}
              <div className="inline-flex items-center">
                <span className="text-sm text-gray-500 mr-2">Priority:</span>
                <select
                  value={ticket.priority}
                  onChange={(e) => handleUpdatePriority(e.target.value)}
                  disabled={updating}
                  className="form-select block w-full pl-3 pr-10 py-1 text-base leading-6 border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              {/* Assign dropdown */}
              <div className="inline-flex items-center">
                <span className="text-sm text-gray-500 mr-2">Assigned To:</span>
                <select
                  value={ticket.assignedTo?._id || ''}
                  onChange={(e) => handleAssignTicket(e.target.value)}
                  disabled={updating}
                  className="form-select block w-full pl-3 pr-10 py-1 text-base leading-6 border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="">Unassigned</option>
                  {admins.map(admin => (
                    <option key={admin._id} value={admin._id}>
                      {admin.email}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-2 mt-2">
                <div className="bg-gray-100 px-2 py-1 rounded text-xs">
                  Category: {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:px-6">
          <div className="space-y-6">
            {/* Customer Review (if exists) */}
            {ticket.review && (
              <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900">Customer Feedback</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(ticket.review.reviewedAt)}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="flex">
                      {[0, 1, 2, 3, 4].map((starIdx) => (
                        <StarSolidIcon
                          key={starIdx}
                          className={`${
                            starIdx < ticket.review.rating ? 'text-yellow-400' : 'text-gray-300'
                          } h-5 w-5 flex-shrink-0`}
                        />
                      ))}
                    </div>
                    <p className="ml-2 text-sm font-medium text-gray-700">
                      {ticket.review.rating} out of 5 stars
                    </p>
                  </div>
                  {ticket.review.comment && (
                    <p className="mt-3 text-sm text-gray-600 italic bg-white p-3 rounded-md border border-gray-100">
                      "{ticket.review.comment}"
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Ticket Messages */}
            <div className="space-y-8">
              {ticket.replies.map((reply, index) => {
                const isAdmin = reply.senderRole === 'admin';
                const isCurrentUser = reply.sender._id === user.id;
                
                return (
                  <div key={index} className="flex">
                    <div className={`flex-shrink-0 ${isAdmin ? 'mr-4' : 'ml-4 order-last'}`}>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isAdmin ? 'bg-primary-100' : 'bg-gray-100'}`}>
                        {isAdmin ? (
                          <ShieldCheckIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                        ) : (
                          <UserCircleIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
                        )}
                      </div>
                    </div>
                    
                    <div className={`flex-1 ${isAdmin ? '' : 'flex flex-col items-end'} space-y-1`}>
                      <div className="flex items-center">
                        <p className={`text-sm font-medium ${isAdmin ? 'text-primary-600' : 'text-gray-900'}`}>
                          {isAdmin ? (isCurrentUser ? 'You' : reply.sender.email) : ticket.userId?.email || 'Customer'}
                        </p>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className={`text-xs ${isAdmin ? 'text-primary-600' : 'text-gray-500'}`}>
                          {isAdmin ? 'Admin' : 'Customer'}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <time dateTime={reply.createdAt} className="text-xs text-gray-500">
                          {formatDate(reply.createdAt)}
                        </time>
                      </div>
                      <div className={`${
                        isAdmin 
                          ? 'bg-primary-50 text-gray-800' 
                          : 'bg-gray-100 text-gray-800'
                        } rounded-lg px-4 py-3 sm:px-6 max-w-3xl`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{reply.message}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSubmitReply} className="mt-6">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Reply to Customer
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Type your reply here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  {sending ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTicketDetailPage;
