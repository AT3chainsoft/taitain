import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  
  console.log("AdminRoute:", { 
    path: location.pathname,
    isAuthenticated, 
    isAdmin, 
    loading 
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="ml-3 text-gray-700">Authenticating...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (!isAdmin) {
    console.warn("User is authenticated but not an admin. Redirecting to dashboard.");
    // Redirect to dashboard if not an admin
    return <Navigate to="/dashboard" />;
  }

  // User is authenticated and is an admin
  return children;
};

export default AdminRoute;
