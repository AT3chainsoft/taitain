import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StakingCard = ({ amount, percentage, lockPeriod }) => {
  const weekly = amount * (percentage / 100);
  const monthly = weekly * 4;
  const totalProfit = monthly * lockPeriod;
  const totalReturn = amount + totalProfit;

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      navigate('/staking', { state: { packageType: amount.toString(), amount, lockPeriod } });
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse-slow"></div>
      <div className="relative bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 group-hover:transform group-hover:-translate-y-1">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-4 text-center">
          <h3 className="font-bold text-xl">${amount} USDT Package</h3>
          <div className="text-xs mt-1 text-primary-100">Lock period: {lockPeriod} {lockPeriod === 1 ? 'month' : 'months'}</div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Weekly Return:</span>
            <span className="font-medium text-primary-600">{percentage}% (${weekly.toFixed(2)})</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Monthly Return:</span>
            <span className="font-medium text-primary-600">${monthly.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Total Profit:</span>
            <span className="font-medium text-green-600">${totalProfit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2">
            <span>Total Return:</span>
            <span className="text-primary-700">${totalReturn.toFixed(2)}</span>
          </div>
          <button
            onClick={handleClick}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3 px-4 rounded-md transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            Stake Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default StakingCard;
