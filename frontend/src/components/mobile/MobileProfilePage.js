import React, { useState } from 'react';
import { 
  UserCircleIcon,
  KeyIcon,
  PencilIcon,
  CheckIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const MobileProfilePage = () => {
  const { user } = useAuth() || { user: {} };
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });
  
  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, would call an API to update the profile
    // For now, just close the edit form
    setIsEditing(false);
  };
  
  return (
    <div className="mobile-page-transition px-4 py-6">
      <div className="text-center mb-6">
        <div className="inline-block p-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={`${user.firstName}'s profile`}
              className="h-24 w-24 rounded-full border-2 border-white"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
              <UserCircleIcon className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input 
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input 
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Last Name"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="sr-only">Email</label>
              <input 
                type="email"
                id="email"
                name="email"
                value={editForm.email}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Email"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <CheckIcon className="h-5 w-5 mx-auto" />
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit Profile
            </button>
          </>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">Account Information</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              <KeyIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span>Change Password</span>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span>Security Settings</span>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">Staking Statistics</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Total Staked</p>
            <p className="text-lg font-bold text-gray-900">${user?.totalStaked?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Total Earned</p>
            <p className="text-lg font-bold text-green-600">${user?.totalEarned?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Active Packages</p>
            <p className="text-lg font-bold text-gray-900">{user?.activePackages || 0}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Referred Users</p>
            <p className="text-lg font-bold text-gray-900">{user?.referralsCount || 0}</p>
          </div>
        </div>
      </div>
      
      <Link 
        to="/referral" 
        className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl shadow-sm text-center font-medium"
      >
        My Referral Program
      </Link>
    </div>
  );
};

export default MobileProfilePage;
