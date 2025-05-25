import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';
import { motion } from 'framer-motion'; // Add this import for motion components
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  PlusCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const MobileDashboard = () => {
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

  // Mobile-optimized stat card component
  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white rounded-lg shadow-sm p-3">
      <div className="flex items-center">
        <div className={`rounded-full p-2 ${colorClass} bg-opacity-10`}>
          <Icon className={`h-4 w-4 ${colorClass}`} />
        </div>
        <div className="ml-3">
          <h3 className="text-xs font-medium text-gray-500">{title}</h3>
          <p className="text-sm font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-16">
         
      {/* Redesigned Balance Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-primary-600 p-1 shadow-lg mt-4">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/0"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white/10 to-transparent"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-1 left-4 h-8 w-8 rounded-full bg-white/10"></div>
        <div className="absolute bottom-3 right-6 h-12 w-12 rounded-full bg-white/5"></div>
        
        <div className="relative bg-gradient-to-br from-indigo-900/80 to-primary-900/80 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex flex-col">
            <h2 className="text-xs font-medium text-indigo-100 mb-1">Available Balance</h2>
            <div className="flex items-end space-x-1 mb-4">
              <p className="text-2xl font-bold text-white">
                ${user?.balance?.toFixed(2) || '0.00'}
              </p>
              <p className="text-xs text-indigo-200 mb-1">USDT</p>
            </div>
            
            <div className="mt-1 grid grid-cols-2 gap-2">
              <motion.div whileTap={{ scale: 0.97 }}>
                <Link 
                  to="/deposit" 
                  className="flex items-center justify-center py-2 px-3 bg-white bg-opacity-20 hover:bg-opacity-25 active:bg-opacity-30 backdrop-blur-sm rounded-lg shadow-sm transition-all"
                >
                  <svg className="w-4 h-4 text-white mr-1.5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4V20M12 4L6 10M12 4L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm font-medium text-white">Deposit</span>
                </Link>
              </motion.div>
              
              <motion.div whileTap={{ scale: 0.97 }}>
                <Link 
                  to="/withdraw" 
                  className="flex items-center justify-center py-2 px-3 bg-white/10 hover:bg-white/15 active:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm transition-all"
                >
                  <svg className="w-4 h-4 text-white mr-1.5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 20V4M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm font-medium text-white">Withdraw</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row - Grid of 2 for better mobile display */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Total Staked"
          value={`$${stats.totalStakedAmount.toFixed(2)}`}
          icon={ArrowTrendingUpIcon}
          colorClass="text-blue-600"
        />
        <StatCard
          title="Total Profits"
          value={`$${stats.totalEarnedProfits.toFixed(2)}`}
          icon={ArrowPathIcon}
          colorClass="text-green-600"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Active Stakings"
          value={stats.activeStakings}
          icon={CurrencyDollarIcon}
          colorClass="text-purple-600"
        />
        <StatCard
          title="Referral Earnings"
          value={`$${user?.referralEarnings?.toFixed(2) || '0.00'}`}
          icon={UserGroupIcon}
          colorClass="text-orange-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-sm font-medium p-3 border-b border-gray-100">Quick Actions</h3>
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          <Link to="/staking" className="flex flex-col items-center justify-center py-3">
            <PlusCircleIcon className="h-5 w-5 text-primary-600" />
            <span className="mt-1 text-xs">Start Staking</span>
          </Link>
          <Link to="/referral" className="flex flex-col items-center justify-center py-3">
            <UserGroupIcon className="h-5 w-5 text-primary-600" />
            <span className="mt-1 text-xs">Invite Friends</span>
          </Link>
          <Link to="/support" className="flex flex-col items-center justify-center py-3">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600" />
            <span className="mt-1 text-xs">Get Support</span>
          </Link>
        </div>
      </div>

      {/* Active Stakings - Card-based layout instead of table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <h2 className="text-sm font-medium">Active Stakings</h2>
          <Link 
            to="/mobile/staking"
            className="text-xs font-medium text-primary-600"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
          </div>
        ) : stakings.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {stakings.slice(0, 3).map((staking) => (
              <div key={staking._id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-medium text-gray-900">
                      {staking.packageType === 'custom' ? 'Custom Package' : `$${staking.packageType} Package`}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {staking.weeklyReturnPercent}% weekly return
                    </p>
                  </div>
                  <span className={`text-xs rounded-full px-2 py-0.5 ${
                    staking.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {staking.status}
                  </span>
                </div>
                
                <div className="mt-2 flex justify-between items-center">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Amount: </span>
                      <span className="font-medium">${staking.amount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Profit: </span>
                      <span className="font-medium text-green-600">${staking.profitsEarned.toFixed(2)}</span>
                    </div>
                  </div>
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
            
            {stakings.length > 3 && (
              <div className="p-3 text-center">
                <Link 
                  to="/staking" 
                  className="text-xs text-primary-600 font-medium"
                >
                  View all {stakings.length} stakings
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500 mb-3">No active stakings yet.</p>
            <Link 
              to="/staking" 
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-primary-600"
            >
              Start Staking
            </Link>
          </div>
        )}
      </div>

      {/* Support Card - Simplified for mobile */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-3 flex items-start space-x-3">
          <div className="flex-shrink-0">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Need help?</h3>
            <p className="mt-1 text-xs text-gray-600">
              Our support team is ready to assist you.
            </p>
            <Link
              to="/support"
              className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-primary-600"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
