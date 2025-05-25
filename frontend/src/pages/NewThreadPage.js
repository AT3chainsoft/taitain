import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import {
  ChevronLeftIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const NewThreadPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to create a thread');
      navigate('/login');
      return;
    }
    
    fetchCategories();
    
    // Check URL for category parameter
    const params = new URLSearchParams(location.search);
    const categorySlug = params.get('category');
    
    if (categorySlug) {
      fetchCategoryBySlug(categorySlug);
    } else {
      setCategoryLoading(false);
    }
  }, [isAuthenticated, navigate, location]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/forum/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryBySlug = async (slug) => {
    try {
      setCategoryLoading(true);
      const response = await axios.get(`/api/forum/categories/${slug}`);
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          categoryId: response.data.data.category._id
        }));
      }
    } catch (error) {
      console.error('Error fetching category by slug:', error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please provide a title');
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error('Please provide content for your thread');
      return;
    }
    
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const response = await axios.post('/api/forum/threads', formData);
      
      if (response.data.success) {
        toast.success('Thread created successfully!');
        navigate(`/forum/thread/${response.data.data._id}/${response.data.data.slug}`);
      }
    } catch (error) {
      toast.error('Failed to create thread');
      console.error('Error creating thread:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || categoryLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          to="/forum"
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          Back to Forum
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h1 className="text-lg leading-6 font-medium text-gray-900">
            Create a New Thread
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Share your thoughts, ask questions, or start a discussion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Thread title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <select
                  id="categoryId"
                  name="categoryId"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="content"
                  name="content"
                  rows={8}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Write your post here..."
                  value={formData.content}
                  onChange={handleChange}
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Be respectful and follow the community guidelines
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Community Guidelines</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Please ensure your post follows our community guidelines. Be respectful,
                      stay on topic, and don't post offensive or illegal content.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forum"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Thread'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewThreadPage;
