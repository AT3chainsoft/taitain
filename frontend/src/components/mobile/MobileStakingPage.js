import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  ChartBarIcon, 
  LockClosedIcon, 
  ArrowTrendingUpIcon, 
  ArrowPathIcon, 
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

// Mobile-optimized staking card component
const StakingCard = ({ amount, percentage, lockPeriod, onSelect }) => {
  const weekly = amount * (percentage / 100);
  const totalProfit = weekly * 4 * lockPeriod;
  
  // Determine card accent based on amount
  const getCardAccent = () => {
    if (amount >= 5000) return 'from-purple-500 to-indigo-600';
    if (amount >= 1000) return 'from-blue-500 to-indigo-500';
    if (amount >= 500) return 'from-cyan-500 to-blue-500';
    return 'from-teal-400 to-cyan-500';
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-sm bg-white border border-gray-100">
      {/* Accent top bar with gradient */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${getCardAccent()}`}></div>
      
      {/* Package header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-3 py-2">
        <h3 className="font-bold text-base text-center">${amount} USDT</h3>
      </div>
      
      {/* Card content */}
      <div className="p-3 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center text-gray-600">
            <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-1 text-primary-500" />
            <span>Weekly Return</span>
          </div>
          <span className="font-medium text-primary-600">{percentage}%</span>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center text-gray-600">
            <LockClosedIcon className="h-3.5 w-3.5 mr-1 text-primary-500" />
            <span>Lock Period</span>
          </div>
          <span className="font-medium text-gray-800">{lockPeriod} {lockPeriod === 1 ? 'month' : 'months'}</span>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center text-gray-600">
            <ChartBarIcon className="h-3.5 w-3.5 mr-1 text-primary-500" />
            <span>Total Profit</span>
          </div>
          <span className="font-medium text-green-600">${totalProfit.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-100">
          <span className="text-gray-700 font-medium">Total Return</span>
          <span className="font-bold text-sm text-primary-700">${(amount + totalProfit).toFixed(2)}</span>
        </div>
        
        <button
          onClick={() => onSelect({ packageType: amount.toString(), amount, lockPeriod })}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-3 rounded-md text-sm mt-2"
        >
          Select Package
        </button>
      </div>
    </div>
  );
};

// Mobile-optimized custom package form
const CustomPackageForm = ({ onSelect }) => {
  const [amount, setAmount] = useState(1000);
  const [lockPeriod, setLockPeriod] = useState(3);
  
  // Calculate weekly return based on amount
  const weeklyReturnPercent = amount >= 5000 ? 3 : 2.5;
  const weeklyReturn = (amount * weeklyReturnPercent) / 100;
  const totalProfit = weeklyReturn * 4 * lockPeriod;
  
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
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
      <div className="bg-gray-50 p-3 border-b border-gray-200">
        <h3 className="text-base font-medium text-gray-800">Custom Package</h3>
        <p className="text-xs text-gray-500 mt-0.5">Personalize your investment</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 space-y-4">
        <div className="space-y-3">
          <div>
            <label htmlFor="amount" className="block text-xs font-medium text-gray-700 mb-1">
              Amount (USDT)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-xs">$</span>
              </div>
              <input
                type="number"
                id="amount"
                name="amount"
                min="100"
                step="100"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="block w-full pl-7 pr-12 py-1.5 text-sm border-gray-300 rounded-md"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-xs">USDT</span>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="lockPeriod" className="block text-xs font-medium text-gray-700 mb-1">
              Lock Period
            </label>
            <select
              id="lockPeriod"
              name="lockPeriod"
              value={lockPeriod}
              onChange={(e) => setLockPeriod(Number(e.target.value))}
              className="block w-full pl-3 pr-10 py-1.5 text-sm border-gray-300 rounded-md"
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
        
        <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-2 rounded-md shadow-sm">
              <span className="text-xs text-gray-500 block">Weekly Return</span>
              <div className="flex items-center mt-0.5">
                <span className="font-medium text-sm">{weeklyReturnPercent}%</span>
                <span className="text-xs text-gray-500 ml-1">(${weeklyReturn.toFixed(2)})</span>
              </div>
            </div>
            
            <div className="bg-white p-2 rounded-md shadow-sm">
              <span className="text-xs text-gray-500 block">Total Profit</span>
              <div className="flex items-center mt-0.5">
                <span className="font-medium text-sm text-green-600">${totalProfit.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md text-sm"
        >
          Create Custom Package
        </button>
      </form>
    </div>
  );
};

// Mobile-optimized confirmation modal
const ConfirmStakingModal = ({ packageData, onConfirm, onCancel, userBalance }) => {
  const weekly = packageData.amount * (packageData.weeklyReturnPercent || (packageData.amount >= 5000 ? 3 : 2.5)) / 100;
  const totalProfit = weekly * 4 * packageData.lockPeriod;
  const totalReturn = packageData.amount + totalProfit;
  
  const hasEnoughBalance = userBalance >= packageData.amount;
  
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        
        {/* Modal panel - smaller for mobile */}
        <div className="relative inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-full max-w-sm mx-auto mt-16">
          {/* Modal header with decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary-600"></div>
          
          {/* Close button */}
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-500 z-10"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="bg-white px-4 pt-6 pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 sm:mx-0 sm:h-8 sm:w-8">
                <LockClosedIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-base font-medium text-gray-900">
                  Confirm Staking
                </h3>
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Package:</div>
                    <div className="font-medium text-primary-700">
                      {packageData.packageType === 'custom' ? 'Custom' : `$${packageData.packageType}`}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Amount:</div>
                    <div className="font-medium">${packageData.amount.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Weekly Return:</div>
                    <div className="font-medium text-primary-600">
                      {packageData.weeklyReturnPercent || (packageData.amount >= 5000 ? 3 : 2.5)}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Lock Period:</div>
                    <div className="font-medium">{packageData.lockPeriod} {packageData.lockPeriod === 1 ? 'month' : 'months'}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Total Profit:</div>
                    <div className="font-medium text-green-600">${totalProfit.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-1.5 mt-1 border-t border-gray-200">
                    <div className="font-medium text-gray-800">Total Return:</div>
                    <div className="font-bold text-primary-700">${totalReturn.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              
              {!hasEnoughBalance && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-md text-xs">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-red-500 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Insufficient Balance</span>
                  </div>
                  <p className="mt-1">Required: ${packageData.amount.toFixed(2)}</p>
                  <p>Available: ${userBalance.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 flex flex-col gap-2">
            <button
              type="button"
              className={`w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white 
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
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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

// Main component
const MobileStakingPage = () => {
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
  
  // Tab navigation component
  const TabNavigation = () => (
    <div className="flex border-b border-gray-200 mb-4">
      <button
        className={`py-2 px-4 text-sm font-medium flex items-center ${
          activeTab === 'packages'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('packages')}
      >
        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
        Packages
      </button>
      <button
        className={`py-2 px-4 text-sm font-medium flex items-center ${
          activeTab === 'active'
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('active')}
      >
        <ChartBarIcon className="h-4 w-4 mr-1" />
        My Stakings
      </button>
    </div>
  );
  
  // Packages tab content
  const renderStakingPackages = () => (
    <div className="space-y-6">
      {/* Balance summary */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-gray-500">Available Balance</p>
            <h3 className="text-xl font-bold mt-0.5 text-gray-900">${user?.balance?.toFixed(2) || '0.00'}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Available for staking</p>
          </div>
          <div className="bg-blue-100 p-2 rounded-full">
            <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Featured packages section */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <div className="bg-primary-100 p-1 rounded-md mr-2">
            <ArrowTrendingUpIcon className="h-4 w-4 text-primary-700" />
          </div>
          Featured Packages
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StakingCard amount={100} percentage={2.5} lockPeriod={1} onSelect={handlePackageSelect} />
          <StakingCard amount={500} percentage={2.5} lockPeriod={3} onSelect={handlePackageSelect} />
          <StakingCard amount={1000} percentage={2.5} lockPeriod={3} onSelect={handlePackageSelect} />
          <StakingCard amount={5000} percentage={3} lockPeriod={5} onSelect={handlePackageSelect} />
        </div>
      </div>
      
      {/* Custom package */}
      <CustomPackageForm onSelect={handlePackageSelect} />
    </div>
  );

  // Active stakings tab content
  const renderActiveStakings = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
          <svg className="mx-auto h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-red-800">{error}</h3>
        </div>
      );
    }

    if (stakings.length === 0) {
      return (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
            <LockClosedIcon className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-gray-900">No Active Stakings</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
            Start staking to earn passive rewards!
          </p>
          <button 
            onClick={() => setActiveTab('packages')} 
            className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600"
          >
            Start Staking
          </button>
        </div>
      );
    }

    // Calculate summary stats
    const totalStaked = stakings.reduce((acc, staking) => acc + staking.amount, 0);
    const totalEarned = stakings.reduce((acc, staking) => acc + staking.profitsEarned, 0);
    const activeCount = stakings.filter(staking => staking.status === 'Active').length;
    
    return (
      <div className="space-y-4">
        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-lg p-3 shadow-sm text-center">
            <p className="text-xs font-medium text-gray-500">Total Staked</p>
            <h3 className="mt-1 text-sm font-bold text-gray-900">${totalStaked.toFixed(2)}</h3>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm text-center">
            <p className="text-xs font-medium text-gray-500">Profit Earned</p>
            <h3 className="mt-1 text-sm font-bold text-green-600">${totalEarned.toFixed(2)}</h3>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm text-center">
            <p className="text-xs font-medium text-gray-500">Active Plans</p>
            <h3 className="mt-1 text-sm font-bold text-gray-900">{activeCount}</h3>
          </div>
        </div>
        
        {/* Staking cards */}
        <div className="space-y-3">
          {stakings.map((staking) => {
            const startDate = new Date(staking.startDate);
            const endDate = new Date(staking.endDate);
            const now = new Date();
            const remaining = endDate - now;
            const remainingDays = Math.max(0, Math.floor(remaining / (1000 * 60 * 60 * 24)));
            const progress = Math.min(100, Math.max(0, Math.floor((now - startDate) / (endDate - startDate) * 100)));
            
            return (
              <div key={staking._id} className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-medium text-gray-900">
                      {staking.packageType === 'custom' ? 'Custom' : `$${staking.packageType} Package`}
                    </h3>
                    <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                      staking.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {staking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-medium ml-1">${staking.amount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Weekly:</span>
                      <span className="font-medium ml-1">{staking.weeklyReturnPercent}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-3 py-2 bg-gray-50 text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <CalendarIcon className="h-3 w-3 text-gray-500 inline mr-1" />
                      <span>{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</span>
                    </div>
                    <span className="font-medium text-green-600">
                      +${staking.profitsEarned.toFixed(2)}
                    </span>
                  </div>
                  
                  {staking.status === 'Active' && remainingDays > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{progress}% complete</span>
                        <span>{remainingDays} days left</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-primary-600 h-1.5 rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-16"> {/* Bottom padding for mobile navigation */}
      <div className="px-1">
        <TabNavigation />
        
        {/* Main content area */}
        <div>
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

export default MobileStakingPage;
