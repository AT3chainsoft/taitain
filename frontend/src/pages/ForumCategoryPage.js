import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import {
  ChevronLeftIcon,
  ChatBubbleLeftRightIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ClockIcon,
  MapPinIcon, // Replace PinIcon with MapPinIcon
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const ForumCategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCategory();
  }, [slug, pagination.page]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/forum/categories/${slug}?page=${pagination.page}`);
      
      setCategory(response.data.data.category);
      setThreads(response.data.data.threads);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error('Failed to load category threads');
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // Redirect to the search page with the search term
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <div className="space-y-6">
      <Link
        to="/forum"
        className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
      >
        <ChevronLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
        Back to Categories
      </Link>
      
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              {loading && !category ? (
                <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                  {category?.name || 'Loading...'}
                </h2>
              )}
              {loading && !category ? (
                <div className="h-5 w-96 bg-gray-200 rounded mt-2 animate-pulse"></div>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  {category?.description || ''}
                </p>
              )}
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <form onSubmit={handleSearch} className="relative rounded-md shadow-sm mr-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search in this category..."
                />
              </form>
              
              {isAuthenticated && (
                <Link
                  to={`/forum/new-thread?category=${slug}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New Thread
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : threads.length > 0 ? (
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {threads.map((thread) => (
                <li key={thread._id}>
                  <Link 
                    to={`/forum/thread/${thread._id}/${thread.slug}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="sm:flex sm:items-center sm:justify-start">
                          {thread.isPinned && (
                            <MapPinIcon // Replace PinIcon with MapPinIcon
                              className="h-5 w-5 text-primary-600 mr-1.5 flex-shrink-0 rotate-45" 
                              aria-hidden="true"
                              title="Pinned thread"
                            />
                          )}
                          {thread.isLocked && (
                            <LockClosedIcon 
                              className="h-5 w-5 text-red-500 mr-1.5 flex-shrink-0" 
                              aria-hidden="true"
                              title="Thread locked"
                            />
                          )}
                          <p className={`text-sm font-medium text-primary-600 break-words ${thread.isPinned ? 'font-bold' : ''}`}>
                            {thread.title}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                            {thread.viewCount} views
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <UserCircleIcon 
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" 
                              aria-hidden="true" 
                            />
                            {thread.author?.email || 'Unknown'}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <ClockIcon 
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" 
                            aria-hidden="true" 
                          />
                          <p>
                            Last activity {formatDate(thread.lastPostAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                    disabled={pagination.page <= 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, prev.pages) }))}
                    disabled={pagination.page >= pagination.pages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                        disabled={pagination.page <= 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      
                      {/* Page numbers would go here */}
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {pagination.page} of {pagination.pages}
                      </span>
                      
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, prev.pages) }))}
                        disabled={pagination.page >= pagination.pages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronLeftIcon className="h-5 w-5 transform rotate-180" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No threads yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get the conversation started by creating the first thread.
            </p>
            {isAuthenticated && (
              <div className="mt-6">
                <Link
                  to={`/forum/new-thread?category=${slug}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                >
                  <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New Thread
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumCategoryPage;
