import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import {
  ChatBubbleLeftRightIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  LockClosedIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const ForumManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: 'ChatBubbleLeftRightIcon'
  });

  useEffect(() => {
    fetchCategories();
    fetchRecentThreads();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await axios.get('/api/forum/categories');
      if (response.data && response.data.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load forum categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchRecentThreads = async () => {
    try {
      setLoadingThreads(true);
      const response = await axios.get('/api/forum/threads?limit=10');
      if (response.data && response.data.data) {
        setThreads(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load recent threads');
    } finally {
      setLoadingThreads(false);
    }
  };
  
  const handleNewCategorySubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('/api/forum/categories', newCategory);
      toast.success('Category created successfully');
      setNewCategory({ name: '', description: '', icon: 'ChatBubbleLeftRightIcon' });
      setShowNewCategoryForm(false);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleInitializeCategories = async () => {
    try {
      await axios.post('/api/forum/setup');
      toast.success('Forum setup completed!');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to setup forum');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forum Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage forum categories and monitor forum activity
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {showNewCategoryForm ? 'Cancel' : 'New Category'}
          </button>
        </div>
      </div>

      {/* New Category Form */}
      {showNewCategoryForm && (
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Create New Category</h2>
            <form onSubmit={handleNewCategorySubmit} className="mt-5 space-y-5">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                    Icon
                  </label>
                  <select
                    id="icon"
                    name="icon"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="ChatBubbleLeftRightIcon">Chat Bubble</option>
                    <option value="UserGroupIcon">User Group</option>
                    <option value="QuestionMarkCircleIcon">Question Mark</option>
                    <option value="CurrencyDollarIcon">Currency Dollar</option>
                    <option value="ShieldCheckIcon">Shield Check</option>
                    <option value="AcademicCapIcon">Academic Cap</option>
                    <option value="SparklesIcon">Sparkles</option>
                  </select>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    required
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewCategoryForm(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Forum Categories</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your forum categories</p>
        </div>
        
        {loadingCategories ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Threads
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                          <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          <div className="text-sm text-gray-500">Slug: {category.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{category.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{category.threadCount || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/forum/category/${category.slug}`}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        <EyeIcon className="h-5 w-5 inline" />
                      </Link>
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <PencilSquareIcon className="h-5 w-5 inline" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new category.
            </p>
            <button 
              onClick={handleInitializeCategories}
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Initialize Default Categories
            </button>
          </div>
        )}
      </div>
      
      {/* Recent Threads */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Threads</h2>
          <p className="mt-1 text-sm text-gray-500">Monitor recent forum activity</p>
        </div>
        
        {loadingThreads ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-gray-500">Loading threads...</p>
          </div>
        ) : threads.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {threads.map(thread => (
              <li key={thread._id} className="px-4 py-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <Link 
                      to={`/forum/thread/${thread._id}/${thread.slug}`}
                      className="block text-sm font-medium text-primary-600 hover:text-primary-800"
                    >
                      <div className="flex items-center">
                        {thread.isPinned && <MapPinIcon className="h-4 w-4 text-primary-500 mr-1" />}
                        {thread.isLocked && <LockClosedIcon className="h-4 w-4 text-red-500 mr-1" />}
                        {thread.title}
                      </div>
                    </Link>
                    <p className="mt-1 text-xs text-gray-500">
                      <span>By: {thread.author?.email || 'Unknown'}</span>
                      <span className="mx-1">•</span>
                      <span>Category: {thread.category?.name || 'Unknown'}</span>
                      <span className="mx-1">•</span>
                      <span>{thread.viewCount || 0} views</span>
                      <span className="mx-1">•</span>
                      <span>Last activity: {formatDate(thread.lastPostAt || thread.createdAt)}</span>
                    </p>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <button 
                      className="text-gray-400 hover:text-primary-600"
                      title={thread.isPinned ? "Unpin thread" : "Pin thread"}
                    >
                      <MapPinIcon className={`h-5 w-5 ${thread.isPinned ? 'text-primary-500' : ''}`} />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-red-600"
                      title={thread.isLocked ? "Unlock thread" : "Lock thread"}
                    >
                      <LockClosedIcon className={`h-5 w-5 ${thread.isLocked ? 'text-red-500' : ''}`} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No threads found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumManagementPage;
