import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  UsersIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalStakings: 0,
    totalWithdrawals: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    totalStakedAmount: 0,
    totalPaidProfits: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching admin dashboard data...');
        const [users, deposits, stakings, withdrawals] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/deposits/all'),
          axios.get('/api/staking/all'),
          axios.get('/api/withdrawals/all')
        ]);

        console.log('Data received:', { users, deposits, stakings, withdrawals });

        // Calculate stats
        const pendingDeposits = deposits.data.data.filter(d => d.status === 'Pending').length;
        const pendingWithdrawals = withdrawals.data.data.filter(w => w.status === 'Pending').length;
        const totalStaked = stakings.data.data.reduce((sum, s) => sum + s.amount, 0);
        const paidProfits = withdrawals.data.data
          .filter(w => w.status === 'Approved')
          .reduce((sum, w) => sum + w.amount, 0);

        setStats({
          totalUsers: users.data.data.length,
          totalDeposits: deposits.data.data.length,
          totalStakings: stakings.data.data.length,
          totalWithdrawals: withdrawals.data.data.length,
          pendingDeposits,
          pendingWithdrawals,
          totalStakedAmount: totalStaked,
          totalPaidProfits: paidProfits
        });
        
        console.log('Stats updated:', stats);

        // Fetch recent activity
        const activityResponse = await axios.get('/api/admin/activity');
        setRecentActivity(activityResponse.data.data || []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtext={`${stats.newUsers24h} new in 24h`}
          icon={UsersIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Deposits"
          value={`$${stats.totalDepositsAmount.toFixed(2)}`}
          subtext={`${stats.pendingDeposits} pending`}
          icon={ArrowDownTrayIcon}
          color="bg-green-500"
          linkTo="/admin/deposits"
        />
        <StatCard
          title="Active Stakings"
          value={stats.activeStakings}
          subtext={`$${stats.totalStakedAmount.toFixed(2)} TVL`}
          icon={CurrencyDollarIcon}
          color="bg-purple-500"
          linkTo="/admin/stakings"
        />
        <StatCard
          title="Pending Withdrawals"
          value={stats.pendingWithdrawals}
          subtext={`$${stats.pendingWithdrawalsAmount.toFixed(2)} total`}
          icon={ArrowPathIcon}
          color="bg-red-500"
          linkTo="/admin/withdrawals"
          priority="high"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add charts for Platform Growth, Daily Volume, etc. */}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4">
              <div className="flex items-center">
                <activity.icon className="h-6 w-6 text-gray-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
                <span className="ml-auto text-sm text-gray-500">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtext, icon: Icon, linkTo, linkText, color }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color} text-opacity-100`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-semibold text-gray-900">{value}</dd>
            {subtext && <dd className="text-sm text-gray-500">{subtext}</dd>}
          </dl>
        </div>
      </div>
    </div>
    {linkTo && linkText && (
      <div className="bg-gray-50 px-5 py-3">
        <Link
          to={linkTo}
          className="text-sm font-medium text-primary-700 hover:text-primary-900"
        >
          {linkText}
        </Link>
      </div>
    )}
  </div>
);

export default DashboardPage;
