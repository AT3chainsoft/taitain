import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline';
import { TrashIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/users');
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (user.walletAddress && user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDeleteUser = async (userId) => {
    if (!confirmDelete || confirmDelete !== userId) {
      setConfirmDelete(userId);
      return;
    }

    try {
      setProcessingAction(userId + '_delete');
      await axios.delete(`/api/users/${userId}`);
      toast.success('User deleted successfully');
      setUsers(users.filter(user => user._id !== userId));
      setConfirmDelete(null);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete user';
      toast.error(errorMessage);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setProcessingAction(userId + '_status');
      const response = await axios.put(`/api/users/${userId}/toggle-status`);
      
      // Update the user status in the local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: response.data.data.status } : user
      ));
      
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'blocked'} successfully`);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update user status';
      toast.error(errorMessage);
    } finally {
      setProcessingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Users Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all users in the system.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <div className="relative rounded-md shadow-sm max-w-xs w-full">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input block w-full pr-10 sm:text-sm sm:leading-5"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referral Earnings
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wallet Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-secondary-100 rounded-full flex items-center justify-center">
                          <span className="text-secondary-600 font-medium text-lg">
                            {user.email ? user.email.charAt(0).toUpperCase() : '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.email || 'No email provided'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user._id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${(user.balance || 0).toFixed(2)} USDT
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${(user.referralEarnings || 0).toFixed(2)} USDT
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {user.walletAddress 
                          ? user.walletAddress.length > 15 
                            ? `${user.walletAddress.substring(0, 8)}...${user.walletAddress.substring(user.walletAddress.length - 8)}`
                            : user.walletAddress 
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        {/* Don't show actions for your own account */}
                        {user.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleToggleUserStatus(user._id, user.status || 'active')}
                              disabled={processingAction === user._id + '_status'}
                              className={`p-1 rounded-full ${
                                (user.status === 'blocked' || !user.status) 
                                  ? 'text-green-600 hover:bg-green-100' 
                                  : 'text-red-600 hover:bg-red-100'
                              }`}
                              title={user.status === 'blocked' ? "Activate User" : "Block User"}
                            >
                              {processingAction === user._id + '_status' ? (
                                <div className="animate-spin h-5 w-5 border-b-2 border-current rounded-full"></div>
                              ) : user.status === 'blocked' ? (
                                <LockOpenIcon className="h-5 w-5" />
                              ) : (
                                <LockClosedIcon className="h-5 w-5" />
                              )}
                            </button>
                            
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={processingAction === user._id + '_delete'}
                              className={`p-1 rounded-full ${
                                confirmDelete === user._id 
                                  ? 'text-red-800 bg-red-100' 
                                  : 'text-red-600 hover:bg-red-100'
                              }`}
                              title={confirmDelete === user._id ? "Click again to confirm" : "Delete User"}
                            >
                              {processingAction === user._id + '_delete' ? (
                                <div className="animate-spin h-5 w-5 border-b-2 border-current rounded-full"></div>
                              ) : (
                                <TrashIcon className="h-5 w-5" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-gray-500">
              No users found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
