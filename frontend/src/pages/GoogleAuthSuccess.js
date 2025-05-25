import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleAuthSuccess = () => {
  const { handleGoogleAuthSuccess, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    if (token) {
      const success = handleGoogleAuthSuccess(token);
      if (success) {
        // Will redirect after auth state is updated
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [location, handleGoogleAuthSuccess, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <h2 className="mt-4 text-xl text-gray-700">Logging you in with Google...</h2>
    </div>
  );
};

export default GoogleAuthSuccess;
