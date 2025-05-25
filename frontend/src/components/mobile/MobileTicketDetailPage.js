import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { 
  ChevronLeftIcon, 
  PaperAirplaneIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/20/solid';

const MobileTicketDetailPage = () => {
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
      navigate('/mobile/support');
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
      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Ticket not found</p>
        <Link 
          to="/mobile/support" 
          className="mt-4 inline-flex items-center text-primary-600"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" aria-hidden="true" />
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
    <div className="space-y-4 pb-16">
      <div className="flex items-center">
        <Link 
          to="/mobile/support" 
          className="inline-flex items-center text-sm text-primary-600"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" aria-hidden="true" />
          Back
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-200">
          <h1 className="text-base font-medium text-gray-900 break-words">
            {ticket.subject}
          </h1>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {getStatusBadge(ticket.status)}
            <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
              {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Created on {formatDate(ticket.createdAt)}
          </div>
        </div>
        
        <div className="px-4 py-4">
          {/* Ticket Messages */}
          <div className="space-y-6">
            {ticket.replies.map((reply, index) => {
              const isAdmin = reply.senderRole === 'admin';
              const isCurrentUser = reply.sender._id === user.id;
              
              return (
                <div key={index} className={`${isAdmin ? '' : 'flex justify-end'}`}>
                  <div className={`max-w-[85%] space-y-1 ${isAdmin ? '' : 'items-end'}`}>
                    <div className="flex items-center text-xs">
                      {isAdmin ? (
                        <>
                          <div className="h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mr-1.5">
                            <ShieldCheckIcon className="h-3 w-3 text-primary-600" />
                          </div>
                          <span className="font-medium text-primary-600">Support Team</span>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">You</span>
                          <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center ml-1.5">
                            <UserCircleIcon className="h-3 w-3 text-gray-600" />
                          </div>
                        </>
                      )}
                    </div>
                    <div className={`${
                      isAdmin 
                        ? 'bg-primary-50 text-gray-800' 
                        : 'bg-gray-100 text-gray-800'
                      } rounded-lg px-3 py-2 text-sm break-words`}
                    >
                      <div className="whitespace-pre-wrap">{reply.message}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(reply.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Review Section for Resolved/Closed Tickets */}
          {ticket.review && (
            <div className="mt-6 p-3 bg-gray-50 rounded-md">
              <h3 className="text-xs font-medium text-gray-900">Your Feedback</h3>
              <div className="mt-2">
                <div className="flex items-center">
                  <div className="flex">
                    {[0, 1, 2, 3, 4].map((starIdx) => (
                      <StarSolidIcon
                        key={starIdx}
                        className={`${
                          starIdx < ticket.review.rating ? 'text-yellow-400' : 'text-gray-300'
                        } h-4 w-4 flex-shrink-0`}
                      />
                    ))}
                  </div>
                  <p className="ml-2 text-xs text-gray-700">
                    {ticket.review.rating} out of 5 stars
                  </p>
                </div>
                {ticket.review.comment && (
                  <p className="mt-2 italic text-xs text-gray-600">
                    "{ticket.review.comment}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Review Form */}
          {canReview && (
            <div className="mt-6 p-3 bg-yellow-50 rounded-md">
              <h3 className="text-xs font-medium text-gray-900">Rate our support</h3>
              <form onSubmit={handleReviewSubmit} className="mt-3">
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
                          <StarSolidIcon className="h-6 w-6 text-yellow-400" />
                        ) : (
                          <StarIcon className="h-6 w-6 text-gray-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-2">
                  <textarea
                    rows={2}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Share your feedback (optional)"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>
                
                <div className="mt-2">
                  <button
                    type="submit"
                    disabled={submittingReview || rating === 0}
                    className="w-full py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 focus:outline-none disabled:opacity-50"
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
              <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-1.5">
                Your Reply
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Type your reply here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <div className="mt-3">
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="w-full inline-flex justify-center items-center py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 focus:outline-none disabled:opacity-50"
                >
                  {sending ? (
                    'Sending...'
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-4 w-4 mr-1.5" />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Closed ticket notice */}
          {ticket.status === 'closed' && !canReview && !ticket.review && (
            <div className="bg-gray-50 p-3 mt-6 rounded-md text-center">
              <p className="text-xs text-gray-600">
                This ticket is closed. If you need further assistance, please open a new ticket.
              </p>
              <Link
                to="/mobile/support/new"
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600"
              >
                Create New Ticket
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileTicketDetailPage;
