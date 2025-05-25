import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  ChartBarIcon, 
  LockClosedIcon, 
  ArrowTrendingUpIcon, 
  ArrowPathIcon, 
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const StakingCard = ({ amount, percentage, lockPeriod, onSelect }) => {
  const weekly = amount * (percentage / 100);
  const monthly = weekly * 4;
  const totalProfit = monthly * lockPeriod;
  const totalReturn = amount + totalProfit;

  // Determine card highlight based on amount
  const getCardAccent = () => {
    if (amount >= 5000) return 'from-purple-500 to-indigo-600';
    if (amount >= 1000) return 'from-blue-500 to-indigo-500';
    if (amount >= 500) return 'from-cyan-500 to-blue-500';
    return 'from-teal-400 to-cyan-500';
  };

  return (
    <div className="relative rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl shadow-lg bg-white border border-gray-100 group">
      {/* Accent top bar with gradient */}
      <div className={`h-2 w-full bg-gradient-to-r ${getCardAccent()}`}></div>
      
      {/* Package header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-5 py-4">
        <h3 className="font-bold text-xl text-center">${amount} USDT</h3>
      </div>
      
      {/* Card content */}
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center text-gray-600">
            <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-primary-500" />
            <span>Weekly Return:</span>
          </div>
          <span className="font-semibold text-primary-600">{percentage}% (${weekly.toFixed(2)})</span>
        </div>
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center text-gray-600">
            <LockClosedIcon className="h-5 w-5 mr-2 text-primary-500" />
            <span>Lock Period:</span>
          </div>
          <span className="font-semibold text-gray-800">{lockPeriod} {lockPeriod === 1 ? 'month' : 'months'}</span>
        </div>
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center text-gray-600">
            <ChartBarIcon className="h-5 w-5 mr-2 text-primary-500" />
            <span>Total Profit:</span>
          </div>
          <span className="font-semibold text-green-600">${totalProfit.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between pb-2">
          <div className="font-bold text-gray-800">Total Return:</div>
          <div className="font-bold text-xl text-primary-700">${totalReturn.toFixed(2)}</div>
        </div>
        
        <button
          onClick={() => onSelect({ packageType: amount.toString(), amount, lockPeriod })}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
        >
          Select Package
        </button>
      </div>
    </div>
  );
};

const CustomPackageForm = ({ onSelect }) => {
  const [amount, setAmount] = useState(1000);
  const [lockPeriod, setLockPeriod] = useState(3);
  
  // Calculate weekly return based on amount
  const weeklyReturnPercent = amount >= 5000 ? 3 : 2.5;
  
  const weeklyReturn = (amount * weeklyReturnPercent) / 100;
  const totalProfit = weeklyReturn * 4 * lockPeriod;
  const totalReturn = amount + totalProfit;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSelect({
      packageType: 'custom',
      amount,
      lockPeriod,
      weeklyReturnPercent
    });
  };
  
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800">Create Custom Package</h3>
        <p className="text-sm text-gray-500 mt-1">Personalize your staking experience</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (USDT)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="amount"
                name="amount"
                min="100"
                step="100"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">USDT</span>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="lockPeriod" className="block text-sm font-medium text-gray-700 mb-1">
              Lock Period (Months)
            </label>
            <select
              id="lockPeriod"
              name="lockPeriod"
              value={lockPeriod}
              onChange={(e) => setLockPeriod(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              required
            >
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="5">5 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
            </select>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <span className="text-xs text-gray-500 block">Weekly Return Rate</span>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-primary-500 mr-1" />
                <span className="font-semibold text-lg">{weeklyReturnPercent}%</span>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <span className="text-xs text-gray-500 block">Weekly Profit</span>
              <div className="flex items-center mt-1">
                <CurrencyDollarIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="font-semibold text-lg text-green-600">${weeklyReturn.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <span className="text-xs text-gray-500 block">Total Profit</span>
              <div className="flex items-center mt-1">
                <ChartBarIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="font-semibold text-lg text-green-600">${totalProfit.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <span className="text-xs text-gray-500 block">Total Return</span>
              <div className="flex items-center mt-1">
                <span className="font-bold text-lg text-primary-700">${totalReturn.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
          >
            Create Custom Package
          </button>
        </div>
      </form>
    </div>
  );
};

const ConfirmStakingModal = ({ packageData, onConfirm, onCancel, userBalance }) => {
  const weekly = packageData.amount * (packageData.weeklyReturnPercent || (packageData.amount >= 5000 ? 3 : 2.5)) / 100;
  const monthly = weekly * 4;
  const totalProfit = monthly * packageData.lockPeriod;
  const totalReturn = packageData.amount + totalProfit;
  
  const hasEnoughBalance = userBalance >= packageData.amount;
  
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        
        {/* Modal centering trick */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Modal header with decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>
          
          <div className="bg-white px-4 pt-8 pb-6 sm:p-8 sm:pb-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                <LockClosedIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Confirm Staking
                </h3>
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-gray-500">
                    Please review your staking details before confirming:
                  </p>
                  
                  <div className="bg-gray-50 p-5 rounded-md shadow-sm border border-gray-100">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <div className="text-sm text-gray-600">Package Type:</div>
                        <div className="font-medium text-primary-700">
                          {packageData.packageType === 'custom' ? 'Custom' : `$${packageData.packageType} Package`}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <div className="flex items-center text-sm text-gray-600">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-500" />
                          Amount:
                        </div>
                        <div className="font-medium">${packageData.amount.toFixed(2)} USDT</div>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <div className="flex items-center text-sm text-gray-600">
                          <ArrowTrendingUpIcon className="h-4 w-4 mr-1 text-gray-500" />
                          Weekly Return:
                        </div>
                        <div className="font-medium text-primary-600">
                          {packageData.weeklyReturnPercent || (packageData.amount >= 5000 ? 3 : 2.5)}% (${weekly.toFixed(2)})
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <div className="flex items-center text-sm text-gray-600">
                          <LockClosedIcon className="h-4 w-4 mr-1 text-gray-500" />
                          Lock Period:
                        </div>
                        <div className="font-medium">{packageData.lockPeriod} {packageData.lockPeriod === 1 ? 'month' : 'months'}</div>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <div className="flex items-center text-sm text-gray-600">
                          <ChartBarIcon className="h-4 w-4 mr-1 text-gray-500" />
                          Total Profit:
                        </div>
                        <div className="font-medium text-green-600">${totalProfit.toFixed(2)} USDT</div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-1">
                        <div className="text-sm font-medium text-gray-800">Total Return:</div>
                        <div className="font-bold text-lg text-primary-700">${totalReturn.toFixed(2)} USDT</div>
                      </div>
                    </div>
                  </div>
                  
                  {!hasEnoughBalance && (
                    <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-md">
                      <div className="flex items-center mb-1">
                        <svg className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Insufficient Balance</span>
                      </div>
                      <p className="text-sm">Your balance: <span className="font-semibold">${userBalance.toFixed(2)} USDT</span></p>
                      <p className="text-sm">Required: <span className="font-semibold">${packageData.amount.toFixed(2)} USDT</span></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-5 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm
                ${hasEnoughBalance 
                  ? 'bg-primary-600 hover:bg-primary-700' 
                  : 'bg-gray-300 cursor-not-allowed'}`}
              onClick={hasEnoughBalance ? onConfirm : null}
              disabled={!hasEnoughBalance}
            >
              Confirm Staking
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StakingPage = () => {
  const [stakings, setStakings] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('packages');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if a package was passed via location state
  useEffect(() => {
    if (location.state) {
      setSelectedPackage(location.state);
    }
  }, [location]);
  
  // Fetch user's stakings
  useEffect(() => {
    const fetchStakings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/staking');
        setStakings(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load staking data');
        setLoading(false);
        console.error('Error fetching staking data:', err);
      }
    };
    
    fetchStakings();
  }, []);
  
  const handlePackageSelect = (packageData) => {
    setSelectedPackage(packageData);
  };
  
  const handleCancelStaking = () => {
    setSelectedPackage(null);
  };
  
  const handleConfirmStaking = async () => {
    try {
      const response = await axios.post('/api/staking', selectedPackage);
      
      toast.success('Staking created successfully!');
      setStakings([...stakings, response.data.data]);
      setSelectedPackage(null);
      setActiveTab('active');
      
      // Update user balance in auth context
      if (user) {
        user.balance -= selectedPackage.amount;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create staking';
      toast.error(errorMessage);
    }
  };
  
  const renderStakingPackages = () => (
    <div className="space-y-12">
      {/* Stats summary at the top */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 shadow border border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-600 text-sm font-medium">Available Balance</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900">${user?.balance?.toFixed(2) || '0.00'}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 text-xs text-blue-600 font-medium">
            Available for staking
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 shadow border border-purple-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-600 text-sm font-medium">Active Stakings</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900">{stakings.filter(s => s.status === 'Active').length}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <LockClosedIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 text-xs text-purple-600 font-medium">
            Currently earning rewards
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6 shadow border border-green-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Earnings</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900">
                ${stakings.reduce((total, stake) => total + stake.profitsEarned, 0).toFixed(2)}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3 text-xs text-green-600 font-medium">
            All-time staking profit
          </div>
        </div>
      </div>

      {/* Featured packages */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="bg-primary-100 p-1.5 rounded-md mr-2">
            <ArrowTrendingUpIcon className="h-5 w-5 text-primary-700" />
          </div>
          Featured Staking Packages
        </h2>
        <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
          <StakingCard amount={100} percentage={2.5} lockPeriod={1} onSelect={handlePackageSelect} />
          <StakingCard amount={500} percentage={2.5} lockPeriod={3} onSelect={handlePackageSelect} />
          <StakingCard amount={1000} percentage={2.5} lockPeriod={3} onSelect={handlePackageSelect} />
          <StakingCard amount={5000} percentage={3} lockPeriod={5} onSelect={handlePackageSelect} />
        </div>
      </div>
      
      {/* Custom package */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="bg-gray-100 p-1.5 rounded-md mr-2">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-700" />
          </div>
          Create Custom Package
        </h2>
        <CustomPackageForm onSelect={handlePackageSelect} />
      </div>
    </div>
  );

  const renderActiveStakings = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-5 rounded-lg shadow-sm border border-red-100 text-center">
          <svg className="mx-auto h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-red-800">{error}</h3>
          <p className="mt-1 text-sm text-red-700">Please try again later or contact support</p>
        </div>
      );
    }

    if (stakings.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
            <LockClosedIcon className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Active Stakings</h3>
          <p className="mt-2 text-gray-500 max-w-sm mx-auto">You don't have any active stakings yet. Start staking to earn passive rewards!</p>
          <button 
            onClick={() => setActiveTab('packages')} 
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 transition-colors duration-200"
          >
            Start Staking Now
          </button>
        </div>
      );
    }

    // If there are stakings, calculate some summary stats
    const totalStaked = stakings.reduce((acc, staking) => acc + staking.amount, 0);
    const totalEarned = stakings.reduce((acc, staking) => acc + staking.profitsEarned, 0);
    const activeStakings = stakings.filter(staking => staking.status === 'Active').length;
    
    return (
      <div className="space-y-8">
        {/* Stats summary at the top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider font-semibold text-purple-600">Total Staked</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">${totalStaked.toFixed(2)}</h3>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider font-semibold text-green-600">Total Earned</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">${totalEarned.toFixed(2)}</h3>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider font-semibold text-blue-600">Active Stakings</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">{activeStakings}</h3>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Your Staking Portfolio</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weekly Return
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Earned
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stakings.map((staking) => {
                  const startDate = new Date(staking.startDate);
                  const endDate = new Date(staking.endDate);
                  const now = new Date();
                  const remaining = endDate - now;
                  const remainingDays = Math.max(0, Math.floor(remaining / (1000 * 60 * 60 * 24)));
                  const progress = Math.min(100, Math.max(0, Math.floor((now - startDate) / (endDate - startDate) * 100)));
                  
                  return (
                    <tr key={staking._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary-700">
                          {staking.packageType === 'custom' ? 'Custom' : `$${staking.packageType} Package`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${staking.amount.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {staking.weeklyReturnPercent}% 
                          <span className="text-xs text-gray-500 ml-1">
                            (${(staking.amount * staking.weeklyReturnPercent / 100).toFixed(2)})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{staking.lockPeriod} months</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
                          {startDate.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
                          {endDate.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">${staking.profitsEarned.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${staking.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {staking.status}
                          </span>
                          
                          {staking.status === 'Active' && remainingDays > 0 && (
                            <div className="flex flex-col">
                              <div className="text-xs text-gray-500">{remainingDays} days left</div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div 
                                  className="bg-primary-600 h-1.5 rounded-full" 
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section with page title and tabs */}
        <div className="pb-6 border-b border-gray-200">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="bg-primary-100 p-1.5 rounded-md mr-3">
                  <ArrowPathIcon className="h-7 w-7 text-primary-700" />
                </span>
                Staking Platform
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Earn passive income by staking your crypto assets
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <div className="inline-flex shadow-sm rounded-md">
                <button
                  type="button"
                  onClick={() => setActiveTab('packages')}
                  className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
                    activeTab === 'packages'
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  } text-sm font-medium transition-colors duration-200 ease-in-out`}
                >
                  <CurrencyDollarIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Packages
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('active')}
                  className={`relative inline-flex items-center px-4 py-2 rounded-r-md border ${
                    activeTab === 'active'
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  } text-sm font-medium -ml-px transition-colors duration-200 ease-in-out`}
                >
                  <ChartBarIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  My Stakings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="mt-8">
          {activeTab === 'packages' ? renderStakingPackages() : renderActiveStakings()}
        </div>
      </div>
      
      {/* Confirmation modal */}
      {selectedPackage && (
        <ConfirmStakingModal 
          packageData={selectedPackage}
          onConfirm={handleConfirmStaking}
          onCancel={handleCancelStaking}
          userBalance={user ? user.balance : 0}
        />
      )}
    </div>
  );
};

export default StakingPage;
