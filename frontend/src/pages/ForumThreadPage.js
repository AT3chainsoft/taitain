import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import {
  ChevronLeftIcon,
  PaperAirplaneIcon,
  ClockIcon,
  UserCircleIcon,
  EyeIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
  TrashIcon,
  MapPinIcon, // Replace PinIcon with MapPinIcon
  LockClosedIcon,
  LockOpenIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  UserIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import ReplyEditor from '../components/forum/ReplyEditor';

const ForumThreadPage = () => {
  const { id, slug } = useParams();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const replyEditorRef = useRef(null);

  useEffect(() => {
    fetchThread();
  }, [id, pagination.page]);
  
  const fetchThread = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/forum/threads/${id}?page=${pagination.page}`);
      
      setThread(response.data.data.thread);
      setPosts(response.data.data.posts);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error('Failed to load thread');
      console.error('Error fetching thread:', error);
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to reply');
      navigate('/login');
      return;
    }
    
    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const response = await axios.post(`/api/forum/threads/${id}/posts`, {
        content: replyContent
      });
      
      // Add the new post to the existing posts
      setPosts([...posts, response.data.data]);
      setReplyContent('');
      setEditorVisible(false);
      
      toast.success('Reply posted successfully');
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.error.includes('locked')) {
        toast.error('This thread is locked. You cannot reply.');
      } else {
        toast.error('Failed to post reply');
      }
      console.error('Error posting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleVote = async (postId, voteType) => {
    if (!isAuthenticated) {
      toast.error('Please login to vote');
      return;
    }
    
    try {
      const response = await axios.post(`/api/forum/posts/${postId}/vote`, {
        voteType
      });
      
      // Update post votes in the UI
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                voteCount: response.data.data.voteCount,
                upvotes: response.data.data.upvotes,
                downvotes: response.data.data.downvotes,
                userVote: response.data.data.userVote
              }
            : post
        )
      );
    } catch (error) {
      toast.error('Failed to vote');
      console.error('Error voting:', error);
    }
  };
  
  const handlePinThread = async () => {
    try {
      await axios.patch(`/api/forum/threads/${id}/pin`);
      setThread(prev => ({
        ...prev,
        isPinned: !prev.isPinned
      }));
      
      toast.success(`Thread ${thread.isPinned ? 'unpinned' : 'pinned'} successfully`);
    } catch (error) {
      toast.error('Failed to update pin status');
      console.error('Error updating pin status:', error);
    }
  };
  
  const handleLockThread = async () => {
    try {
      await axios.patch(`/api/forum/threads/${id}/lock`);
      setThread(prev => ({
        ...prev,
        isLocked: !prev.isLocked
      }));
      
      toast.success(`Thread ${thread.isLocked ? 'unlocked' : 'locked'} successfully`);
    } catch (error) {
      toast.error('Failed to update lock status');
      console.error('Error updating lock status:', error);
    }
  };
  
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/api/forum/posts/${postId}`);
      
      // Update the UI to show the post as deleted
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { ...post, isDeleted: true, content: 'This post has been deleted' }
            : post
        )
      );
      
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
      console.error('Error deleting post:', error);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const scrollToReply = () => {
    setEditorVisible(true);
    setTimeout(() => {
      replyEditorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  if (loading && !thread) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!thread) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Thread not found</p>
        <Link
          to="/forum"
          className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-800"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          Back to Forum
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link
          to={`/forum/category/${thread.category.slug}`}
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          Back to {thread.category.name}
        </Link>
        
        {/* Quick reply button for mobile */}
        <button
          onClick={scrollToReply}
          className="md:hidden inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <PaperAirplaneIcon className="h-4 w-4 mr-1" aria-hidden="true" />
          Reply
        </button>
      </div>
      
      {/* Thread header */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {thread.isPinned && (
                  <MapPinIcon 
                    className="h-5 w-5 text-primary-600 transform rotate-45" 
                    aria-hidden="true"
                  />
                )}
                {thread.isLocked && (
                  <LockClosedIcon 
                    className="h-5 w-5 text-red-500" 
                    aria-hidden="true"
                  />
                )}
                <h1 className="text-2xl font-bold text-gray-900 break-words">{thread.title}</h1>
              </div>
              <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <UserIcon className="mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                  <span>{thread.author?.email || 'Unknown user'}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                  <span>{formatDate(thread.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <EyeIcon className="mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                  <span>{thread.viewCount} views</span>
                </div>
              </div>
            </div>
            
            {/* Admin controls */}
            {isAdmin && (
              <div className="mt-4 md:mt-0 flex space-x-2">
                <button
                  onClick={handlePinThread}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <MapPinIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                  {thread.isPinned ? 'Unpin' : 'Pin'}
                </button>
                <button
                  onClick={handleLockThread}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {thread.isLocked ? (
                    <>
                      <LockOpenIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                      Lock
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Thread content */}
        <div className="px-4 py-5 sm:px-6">
          <div className="prose max-w-none prose-sm sm:prose-base prose-primary overflow-hidden">
            <p className="whitespace-pre-wrap">{thread.content}</p>
          </div>
        </div>
      </div>
      
      {/* Posts / Replies */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-200 sm:px-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Responses ({pagination.total})
            </h2>
            {!thread.isLocked && isAuthenticated && (
              <button
                onClick={scrollToReply}
                className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <PaperAirplaneIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Reply
              </button>
            )}
          </div>
        </div>
        
        {posts.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {posts.map((post) => (
              <div key={post._id} className="px-4 py-6 sm:px-6">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {post.author?.email || 'Unknown user'}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4" aria-hidden="true" />
                        <p>{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-700">
                      <p className={`whitespace-pre-wrap ${post.isDeleted ? 'italic text-gray-500' : ''}`}>{post.content}</p>
                    </div>
                    
                    <div className="mt-2 flex justify-between">
                      {/* Vote buttons */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleVote(post._id, post.userVote === 'upvote' ? 'unvote' : 'upvote')}
                            className={`flex items-center p-1 rounded-full ${post.userVote === 'upvote' ? 'text-green-600' : 'text-gray-400 hover:text-gray-500'}`}
                            disabled={post.isDeleted}
                          >
                            <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <span className={`font-medium text-sm px-1 ${
                            post.voteCount > 0 ? 'text-green-600' : 
                            post.voteCount < 0 ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {post.voteCount || 0}
                          </span>
                          <button
                            onClick={() => handleVote(post._id, post.userVote === 'downvote' ? 'unvote' : 'downvote')}
                            className={`flex items-center p-1 rounded-full ${post.userVote === 'downvote' ? 'text-red-600' : 'text-gray-400 hover:text-gray-500'}`}
                            disabled={post.isDeleted}
                          >
                            <ArrowDownIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>

                        <button
                          className="text-sm text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            setReplyContent(`@${post.author?.email} `);
                            scrollToReply();
                          }}
                        >
                          Reply
                        </button>
                      </div>
                      
                      {/* Actions (edit, delete, report) */}
                      {!post.isDeleted && (isAdmin || (isAuthenticated && post.author?._id === user.id)) && (
                        <div className="flex space-x-2">
                          {post.author?._id === user.id && (
                            <button
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="text-sm text-gray-500 hover:text-red-600"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 sm:px-6 text-center">
            <ChatBubbleOvalLeftEllipsisIcon className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No responses yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Be the first to respond to this thread.
            </p>
          </div>
        )}
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                  of <span className="font-medium">{pagination.total}</span> responses
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
        
        {/* Reply form */}
        {isAuthenticated && (editorVisible || !thread.isLocked) && (
          <div className="px-4 py-6 border-t border-gray-200 sm:px-6" ref={replyEditorRef}>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              {thread.isLocked ? (
                <div className="text-red-600 flex items-center">
                  <LockClosedIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  This thread is locked. You cannot reply.
                </div>
              ) : (
                'Post a Reply'
              )}
            </h3>
            
            {!thread.isLocked && (
              <ReplyEditor
                value={replyContent}
                onChange={setReplyContent}
                onSubmit={handleReply}
                isSubmitting={submitting}
              />
            )}
          </div>
        )}
        
        {!isAuthenticated && !thread.isLocked && (
          <div className="px-4 py-6 border-t border-gray-200 sm:px-6 bg-gray-50">
            <div className="text-center">
              <h3 className="text-base font-medium text-gray-900">Want to join the discussion?</h3>
              <div className="mt-3 flex justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Sign in to Reply
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumThreadPage;
