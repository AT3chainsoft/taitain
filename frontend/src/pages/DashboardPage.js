import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalStakedAmount: 0,
    totalEarnedProfits: 0,
    activeStakings: 0
  });
  const [loading, setLoading] = useState(true);
  const [stakings, setStakings] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/staking');
        const userStakings = response.data.data;
        setStakings(userStakings);

        // Calculate stats from actual data
        const totalStaked = userStakings.reduce((sum, staking) => sum + staking.amount, 0);
        const totalProfits = userStakings.reduce((sum, staking) => sum + staking.profitsEarned, 0);
        const activeCount = userStakings.filter(staking => staking.status === 'Active').length;

        setStats({
          totalStakedAmount: totalStaked,
          totalEarnedProfits: totalProfits,
          activeStakings: activeCount
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`rounded-full p-3 ${colorClass} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.email || 'User'}</h1>
        <p className="mt-1 text-primary-100">Here's an overview of your investments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={`$${user?.balance?.toFixed(2) || '0.00'} USDT`}
          icon={CurrencyDollarIcon}
          colorClass="text-green-600"
        />
        <StatCard
          title="Total Staked"
          value={`$${stats.totalStakedAmount.toFixed(2)} USDT`}
          icon={ArrowTrendingUpIcon}
          colorClass="text-blue-600"
        />
        <StatCard
          title="Total Profits"
          value={`$${stats.totalEarnedProfits.toFixed(2)} USDT`}
          icon={ArrowPathIcon}
          colorClass="text-purple-600"
        />
        <StatCard
          title="Referral Earnings"
          value={`$${user?.referralEarnings?.toFixed(2) || '0.00'} USDT`}
          icon={UserGroupIcon}
          colorClass="text-orange-600"
        />
      </div>

      {/* Support Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Need help?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Our support team is ready to assist you with any questions or issues.
              </p>
              <div className="mt-4">
                <Link
                  to="/support"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  View Support Tickets
                </Link>
                <Link
                  to="/support/new"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Create New Ticket
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Stakings Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Active Stakings</h2>
            <Link 
              to="/staking"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Start New Staking
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          {stakings.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weekly Return</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profits Earned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stakings.map((staking) => (
                  <tr key={staking._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {staking.packageType === 'custom' ? 'Custom Package' : `$${staking.packageType} Package`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${staking.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {staking.weeklyReturnPercent}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      ${staking.profitsEarned.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        staking.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {staking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You don't have any active stakings yet.</p>
              <Link 
                to="/staking" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Start Staking
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
