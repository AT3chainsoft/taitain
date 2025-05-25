import React from 'react';
import { ArrowTrendingUpIcon, LockClosedIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const MobileStakingCard = ({ amount, percentage, lockPeriod, onSelect }) => {
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
    <div className="relative rounded-xl overflow-hidden transition-all duration-300 shadow-md bg-white border border-gray-100">
      {/* Accent top bar with gradient */}
      <div className={`h-2 w-full bg-gradient-to-r ${getCardAccent()}`}></div>
      
      {/* Package header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-3">
        <h3 className="font-bold text-lg text-center">${amount} USDT</h3>
      </div>
      
      {/* Card content - optimized for mobile */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center text-gray-600 text-sm">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1 text-primary-500" />
            <span>Weekly:</span>
          </div>
          <span className="font-medium text-sm text-primary-600">{percentage}% (${weekly.toFixed(2)})</span>
        </div>
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center text-gray-600 text-sm">
            <LockClosedIcon className="h-4 w-4 mr-1 text-primary-500" />
            <span>Lock Period:</span>
          </div>
          <span className="font-medium text-sm">{lockPeriod} {lockPeriod === 1 ? 'month' : 'months'}</span>
        </div>
        
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center text-gray-600 text-sm">
            <ChartBarIcon className="h-4 w-4 mr-1 text-primary-500" />
            <span>Total Profit:</span>
          </div>
          <span className="font-medium text-sm text-green-600">${totalProfit.toFixed(2)}</span>
        </div>
        
        <button
          onClick={() => onSelect({ packageType: amount.toString(), amount, lockPeriod })}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-sm"
        >
          Select Package
        </button>
      </div>
    </div>
  );
};

export default MobileStakingCard;
