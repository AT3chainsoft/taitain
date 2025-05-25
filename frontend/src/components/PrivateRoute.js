import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  // Always call hooks at the top level, never conditionally
  const location = useLocation();
  const auth = useAuth();
  
  // Check if auth is undefined or not initialized
  if (!auth) {
    console.warn('Auth context not available in PrivateRoute');
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Now safely access isAuthenticated
  const { isAuthenticated } = auth;

  // Use the location in the Navigate component
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;
