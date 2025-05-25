import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ROICalculator = () => {
  const [amount, setAmount] = useState(500);
  const [lockPeriod, setLockPeriod] = useState(3);
  
  const weeklyReturnPercent = amount >= 5000 ? 3 : 2.5;
  const weeklyReturn = (amount * weeklyReturnPercent) / 100;
  const totalProfit = weeklyReturn * 4 * lockPeriod;
  const totalReturn = amount + totalProfit;
  
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 px-6 py-4 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="absolute right-10 bottom-0 w-16 h-16 bg-white opacity-10 rounded-full blur-md"></div>
        <h3 className="text-xl font-bold text-white relative z-10">ROI Calculator</h3>
        <p className="text-sm text-secondary-100 relative z-10">Calculate your potential earnings</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Amount (USDT)
            </label>
            <input
              type="number"
              min="100"
              step="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="form-input rounded-md w-full focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lock Period (Months)
            </label>
            <select
              value={lockPeriod}
              onChange={(e) => setLockPeriod(Number(e.target.value))}
              className="form-select rounded-md w-full focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
            >
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="5">5 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
            </select>
          </div>
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Weekly Rate:</span>
              <span className="font-medium bg-green-50 text-green-700 px-2 py-1 rounded-full text-sm">{weeklyReturnPercent}%</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Weekly Profit:</span>
              <span className="font-medium text-green-600">${weeklyReturn.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Monthly Profit:</span>
              <span className="font-medium text-green-600">${(weeklyReturn * 4).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-200 mt-2 pt-2">
              <span className="text-gray-800 font-medium">Total Profit:</span>
              <span className="font-medium text-green-600">${totalProfit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 mt-2 bg-gray-50 p-2 rounded-md">
              <span className="text-gray-900 font-bold">Total Return:</span>
              <span className="font-bold text-primary-700 text-xl">${totalReturn.toFixed(2)}</span>
            </div>
          </div>
          
          <div>
            <Link
              to="/register"
              className="block w-full text-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-transform hover:scale-[1.02] transform"
            >
              Start Earning Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
