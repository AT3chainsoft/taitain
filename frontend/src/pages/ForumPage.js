import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import {
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { 
  ChatBubbleLeftEllipsisIcon, 
  UserGroupIcon,
  QuestionMarkCircleIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';

const ForumPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('Fetching forum categories...');
      const response = await axios.get('/api/forum/categories');
      console.log('Forum categories response:', response.data);
      setCategories(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load forum categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getIconComponent = (iconName) => {
    const iconMap = {
      'ChatBubbleLeftRightIcon': ChatBubbleLeftRightIcon,
      'UserGroupIcon': UserGroupIcon,
      'QuestionMarkCircleIcon': QuestionMarkCircleIcon,
      'CurrencyDollarIcon': CurrencyDollarIcon,
      'ShieldCheckIcon': ShieldCheckIcon,
      'AcademicCapIcon': AcademicCapIcon,
      'SparklesIcon': SparklesIcon,
      'ChatBubbleOvalLeftIcon': ChatBubbleOvalLeftIcon
    };
    
    const IconComponent = iconMap[iconName] || ChatBubbleLeftEllipsisIcon;
    return <IconComponent className="h-8 w-8 text-primary-500" aria-hidden="true" />;
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Community Forum
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Join discussions with the Titan community
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <div className="relative rounded-md shadow-sm mr-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search discussions..."
                />
              </div>
              
              {isAuthenticated && (
                <Link
                  to="/forum/new-thread"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New Thread
                </Link>
              )}
            </div>
          </div>
          
          {/* Remove the debug info div that was here */}

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/forum/category/${category.slug}`}
                  className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm hover:shadow-md flex items-start space-x-4 transition duration-150"
                >
                  <div className="flex-shrink-0">
                    {getIconComponent(category.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900">
                      {category.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <ChatBubbleLeftRightIcon className="mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                      <p>{category.threadCount || 0} threads</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="text-center py-12">
              <ChatBubbleLeftEllipsisIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Categories will be added by administrators soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
