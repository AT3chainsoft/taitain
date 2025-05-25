import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as ClockSolidIcon
} from '@heroicons/react/24/outline';

const DepositDetailPage = () => {
  const { id } = useParams();
  const [deposit, setDeposit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeposit = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/deposits/${id}`);
        setDeposit(response.data.data);
      } catch (err) {
        console.error('Error fetching deposit details:', err);
        setError('Failed to load deposit details');
        toast.error('Failed to load deposit details');
      } finally {
        setLoading(false);
      }
    };

    fetchDeposit();
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <ClockSolidIcon className="mr-1 h-4 w-4" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircleIcon className="mr-1 h-4 w-4" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
        <p className="text-red-500">{error}</p>
        <Link to="/dashboard/deposits" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-800">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to deposits
        </Link>
      </div>
    );
  }

  if (!deposit) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
        <p className="text-gray-500">Deposit not found</p>
        <Link to="/dashboard/deposits" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-800">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to deposits
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link
          to="/dashboard/deposits"
          className="inline-flex items-center text-primary-600 hover:text-primary-800"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to deposits
        </Link>
        
        <div>
          {getStatusBadge(deposit.status)}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Deposit Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Transaction ID: {deposit._id}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Amount
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-1" />
                {deposit.amount} {deposit.currency}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Transaction Hash
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-all">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 inline mr-1" />
                {deposit.txHash || 'Not available'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Created At
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-1" />
                {formatDate(deposit.createdAt)}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Updated At
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-1" />
                {formatDate(deposit.updatedAt)}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Status
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {getStatusBadge(deposit.status)}
              </dd>
            </div>
            {deposit.notes && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Notes
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {deposit.notes}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default DepositDetailPage;
