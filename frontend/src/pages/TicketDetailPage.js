import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { 
  ChevronLeftIcon, 
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/20/solid';

const TicketDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchTicket();
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
      navigate('/support');
    } finally {
      setLoading(false);
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
      }
    } catch (error) {
      toast.error('Failed to send reply');
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    try {
      setSubmittingReview(true);
      const response = await axios.put(`/api/tickets/${id}/review`, {
        rating,
        comment: reviewComment
      });
      
      if (response.data.success) {
        setTicket(response.data.data);
        toast.success('Review submitted successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit review');
      console.error('Review submission error:', error);
    } finally {
      setSubmittingReview(false);
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
      low: { color: 'bg-gray-100 text-gray-800', label: 'Low Priority' },
      medium: { color: 'bg-blue-100 text-blue-800', label: 'Medium Priority' },
      high: { color: 'bg-orange-100 text-orange-800', label: 'High Priority' },
      urgent: { color: 'bg-red-100 text-red-800', label: 'Urgent Priority' },
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
        <Link 
          to="/support" 
          className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-800"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          Back to Support
        </Link>
      </div>
    );
  }

  const canReview = ticket && 
    ['resolved', 'closed'].includes(ticket.status) && 
    !ticket.review &&
    ticket.userId._id === user.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link 
          to="/support" 
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          Back to Support
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-lg leading-6 font-medium text-gray-900">
                {ticket.subject}
              </h1>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <ClockIcon className="mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                <p>
                  Created on <time dateTime={ticket.createdAt}>{formatDate(ticket.createdAt)}</time>
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:px-6">
          <div className="space-y-6">
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
                          {isAdmin ? 'Support Team' : isCurrentUser ? 'You' : reply.sender.email}
                        </p>
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

            {/* Review Section for Resolved/Closed Tickets */}
            {ticket.review && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-900">Your Feedback</h3>
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
                    <p className="ml-2 text-sm text-gray-700">
                      {ticket.review.rating} out of 5 stars
                    </p>
                  </div>
                  {ticket.review.comment && (
                    <p className="mt-2 italic text-sm text-gray-600">
                      "{ticket.review.comment}"
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Reviewed on {formatDate(ticket.review.reviewedAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Review Form */}
            {canReview && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-900">Rate our support</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Please take a moment to rate your support experience
                </p>
                
                <form onSubmit={handleReviewSubmit} className="mt-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => setRating(star)}
                        >
                          {star <= rating ? (
                            <StarSolidIcon className="h-7 w-7 text-yellow-400" />
                          ) : (
                            <StarIcon className="h-7 w-7 text-gray-300 hover:text-yellow-200" />
                          )}
                        </button>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {rating ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select rating'}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <textarea
                      rows={2}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Share your feedback (optional)"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReview || rating === 0}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reply Form */}
            {ticket.status !== 'closed' && (
              <form onSubmit={handleSubmitReply} className="mt-6">
                <div>
                  <label htmlFor="message" className="sr-only">
                    Reply
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
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
            )}

            {/* Closed ticket notice */}
            {ticket.status === 'closed' && !canReview && !ticket.review && (
              <div className="bg-gray-50 px-4 py-3 sm:px-6 text-center rounded-md">
                <p className="text-sm text-gray-500">
                  This ticket is closed. If you need further assistance, please open a new ticket.
                </p>
                <Link
                  to="/support/new"
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                >
                  Create New Ticket
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
