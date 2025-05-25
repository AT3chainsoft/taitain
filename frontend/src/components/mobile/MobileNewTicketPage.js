import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { 
  ChevronLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const MobileNewTicketPage = () => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('other');
  const [priority, setPriority] = useState('medium');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
        navigate('/mobile/support');
      }
    } catch (error) {
      toast.error('Failed to create support ticket');
      console.error('Error creating ticket:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-16">
      <div className="flex items-center mb-2">
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
          <h1 className="text-lg font-medium text-gray-900">
            Create Support Ticket
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Our team will respond as soon as possible
          </p>
        </div>
        
        <form className="px-4 py-4" onSubmit={handleSubmit}>
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
          
          <div className="mt-4 flex">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobileNewTicketPage;
